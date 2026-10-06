import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Disable X-Powered-By
app.disable('x-powered-by');

// Add Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Admin supabase client (Service Role) for privileged operations ONLY
// Never expose this to the frontend!
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY 
);

// Helper to get authenticated supabase client for a request
const getAuthClient = (req) => {
    const token = req.cookies.access_token;
    if (!token) return null;

    return createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    );
};

// Middleware to protect routes
const requireAuth = async (req, res, next) => {
    const supabase = getAuthClient(req);
    if (!supabase) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

    req.user = user;
    req.supabase = supabase;
    next();
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// --- AUTH ROUTES ---

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
        if (error) throw error;

        res.cookie('access_token', data.session.access_token, cookieOptions);
        res.cookie('refresh_token', data.session.refresh_token, cookieOptions);
        
        res.json({ user: data.user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabaseAdmin.auth.signUp({ email, password });
        if (error) throw error;
        
        if (data.session) {
            res.cookie('access_token', data.session.access_token, cookieOptions);
            res.cookie('refresh_token', data.session.refresh_token, cookieOptions);
        }
        res.json({ user: data.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
    res.json({ success: true });
});

app.get('/api/auth/session', async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.json({ user: null });

    const supabase = getAuthClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
        res.clearCookie('access_token');
        return res.json({ user: null });
    }
    
    res.json({ user });
});

app.post('/api/auth/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
            redirectTo: `${req.headers.origin}/update-password`,
        });
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/update-password', requireAuth, async (req, res) => {
    const { password } = req.body;
    try {
        const { error } = await req.supabase.auth.updateUser({ password });
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/update-profile', requireAuth, upload.single('file'), async (req, res) => {
    try {
        const { username } = req.body;
        const file = req.file;
        let newAvatarUrl = req.user.user_metadata?.avatar_url;

        if (file) {
            const fileExt = path.extname(file.originalname);
            const fileName = `avatars/${req.user.id}-${Date.now()}${fileExt}`;

            const { error: uploadError } = await req.supabase.storage
                .from('materials')
                .upload(fileName, file.buffer, { contentType: file.mimetype });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = req.supabase.storage
                .from('materials')
                .getPublicUrl(fileName);

            newAvatarUrl = publicUrl;
        }

        const { data, error: updateError } = await req.supabase.auth.updateUser({
            data: {
                username,
                avatar_url: newAvatarUrl
            }
        });

        if (updateError) throw updateError;
        res.json({ user: data.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- API ROUTES ---

// Public endpoint to get materials
app.get('/api/materials', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('materials')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get available subjects for a branch
app.get('/api/subjects', async (req, res) => {
    const { branch } = req.query;
    try {
        const { data, error } = await supabaseAdmin
            .from('materials')
            .select('subject')
            .eq('branch', branch);
            
        if (error) throw error;
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Public endpoint to get a single material
app.get('/api/materials/:id', async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('materials')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Not found' });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Protected endpoint to upload a material
app.post('/api/materials', requireAuth, upload.single('file'), async (req, res) => {
    try {
        const { title, branch, subject, semester, module, college_details, uploader_name } = req.body;
        const file = req.file;
        
        if (!file) return res.status(400).json({ error: 'File is required' });

        const fileExt = path.extname(file.originalname);
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}${fileExt}`;
        const filePath = `${req.user.id}/${fileName}`;

        // Upload to storage using the authenticated client
        const { error: uploadError } = await req.supabase.storage
            .from('materials')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = req.supabase.storage
            .from('materials')
            .getPublicUrl(filePath);

        // Insert to DB using authenticated client (RLS applies)
        const { data, error: dbError } = await req.supabase
            .from('materials')
            .insert({
                title,
                branch,
                subject,
                semester,
                module,
                college_details,
                uploader_name,
                file_url: publicUrl,
                user_id: req.user.id
            })
            .select();

        if (dbError) throw dbError;
        res.json({ data: data[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Admin/Owner delete endpoint
app.delete('/api/materials/:id', requireAuth, async (req, res) => {
    try {
        // First verify the note exists and belongs to the user
        const { data: material, error: fetchError } = await req.supabase
            .from('materials')
            .select('user_id, file_url')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !material) {
            return res.status(404).json({ error: 'Material not found' });
        }

        if (material.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Delete from DB
        const { error: deleteError } = await req.supabase
            .from('materials')
            .delete()
            .eq('id', req.params.id);
            
        if (deleteError) throw deleteError;

        // Best effort file deletion
        try {
            const urlParts = material.file_url.split('/');
            const filePath = urlParts.slice(urlParts.length - 2).join('/');
            await req.supabase.storage.from('materials').remove([filePath]);
        } catch (e) {
            console.error("Could not delete file", e);
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fallback for Vercel Serverless
export default app;

// Listen if not on serverless
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Express API running on port ${port}`);
    });
}
