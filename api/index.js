import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Allowed Origins for CORS and CSRF protection
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL] 
    : ['http://localhost:5173'];

// Security Middleware
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Security Headers using Helmet
app.use(helmet());

// Disable X-Powered-By
app.disable('x-powered-by');

// Add Custom Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// CSRF Protection Middleware
app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const origin = req.headers.origin;
        // If origin is present, it must be in the allowed list
        if (origin && !allowedOrigins.includes(origin)) {
            return res.status(403).json({ error: 'CSRF validation failed: Invalid Origin' });
        }
        // If origin is missing, but it's a production browser request, we might block it.
        // However, we rely on SameSite: lax cookies for primary defense when origin is omitted by older browsers.
    }
    next();
});

// Rate limiting configurations
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, 
    message: { error: 'Too many requests from this IP' },
    standardHeaders: true, 
    legacyHeaders: false, 
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20, 
    message: { error: 'Too many authentication attempts' },
    standardHeaders: true,
    legacyHeaders: false,
});

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30, 
    message: { error: 'Too many uploads' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api', generalLimiter);

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
];

// Admin supabase client (Service Role) ONLY for auth operations requiring it
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY 
);

// Anon client for public requests so RLS is respected
const supabaseAnon = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
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
    maxAge: 7 * 24 * 60 * 60 * 1000
};

// --- AUTH ROUTES ---

app.use('/api/auth', authLimiter);

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
        if (error) return res.status(401).json({ error: 'Invalid credentials' });

        res.cookie('access_token', data.session.access_token, cookieOptions);
        res.cookie('refresh_token', data.session.refresh_token, cookieOptions);
        
        res.json({ user: data.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabaseAdmin.auth.signUp({ email, password });
        if (error) return res.status(400).json({ error: 'Failed to sign up' });
        
        if (data.session) {
            res.cookie('access_token', data.session.access_token, cookieOptions);
            res.cookie('refresh_token', data.session.refresh_token, cookieOptions);
        }
        res.json({ user: data.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/auth/logout', async (req, res) => {
    try {
        const supabase = getAuthClient(req);
        if (supabase) {
            await supabase.auth.signOut();
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
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
        const frontendUrl = process.env.NODE_ENV === 'production' 
            ? process.env.FRONTEND_URL 
            : 'http://localhost:5173';
        
        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
            redirectTo: `${frontendUrl}/update-password`,
        });
        if (error) return res.status(400).json({ error: 'Failed to reset password' });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/auth/update-password', requireAuth, async (req, res) => {
    const { password } = req.body;
    try {
        const { error } = await req.supabase.auth.updateUser({ password });
        if (error) return res.status(400).json({ error: 'Failed to update password' });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/auth/update-profile', requireAuth, upload.single('file'), async (req, res) => {
    try {
        const { username } = req.body;
        const file = req.file;
        let newAvatarUrl = req.user.user_metadata?.avatar_url;

        if (file) {
            if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
                return res.status(400).json({ error: 'Invalid file type' });
            }

            const fileExt = path.extname(file.originalname).replace(/[^a-zA-Z0-9.]/g, '');
            const fileName = `avatars/${req.user.id}-${Date.now()}${fileExt}`;

            const { error: uploadError } = await req.supabase.storage
                .from('materials')
                .upload(fileName, file.buffer, { contentType: file.mimetype });

            if (uploadError) {
                console.error(uploadError);
                return res.status(500).json({ error: 'Upload failed' });
            }

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

        if (updateError) {
            console.error(updateError);
            return res.status(400).json({ error: 'Profile update failed' });
        }
        res.json({ user: data.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- API ROUTES ---

// Helper to resolve client for public routes
const getClient = (req) => {
    return req.cookies.access_token ? getAuthClient(req) : supabaseAnon;
};

// Public endpoint to get materials
app.get('/api/materials', async (req, res) => {
    try {
        const supabase = getClient(req);
        const { data, error } = await supabase
            .from('materials')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get available subjects for a branch
app.get('/api/subjects', async (req, res) => {
    const { branch } = req.query;
    try {
        const supabase = getClient(req);
        const { data, error } = await supabase
            .from('materials')
            .select('subject')
            .eq('branch', branch);
            
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Public endpoint to get a single material
app.get('/api/materials/:id', async (req, res) => {
    try {
        const supabase = getClient(req);
        const { data, error } = await supabase
            .from('materials')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if (error) {
            console.error(error);
            return res.status(404).json({ error: 'Not found' });
        }
        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Protected endpoint to upload a material
app.post('/api/materials', requireAuth, uploadLimiter, upload.single('file'), async (req, res) => {
    try {
        const { title, branch, subject, semester, module, college_details, uploader_name } = req.body;
        const file = req.file;
        
        if (!file) return res.status(400).json({ error: 'File is required' });

        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        const fileExt = path.extname(file.originalname).replace(/[^a-zA-Z0-9.]/g, '');
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}${fileExt}`;
        // Enforce user directory to prevent path traversal
        const filePath = `${req.user.id}/${fileName}`;

        const { error: uploadError } = await req.supabase.storage
            .from('materials')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype
            });

        if (uploadError) {
            console.error(uploadError);
            return res.status(500).json({ error: 'Upload failed' });
        }

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
                user_id: req.user.id // Server-side ownership enforcement
            })
            .select();

        if (dbError) {
            console.error(dbError);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ data: data[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
            
        if (deleteError) {
            console.error(deleteError);
            return res.status(500).json({ error: 'Database error' });
        }

        // Best effort file deletion
        try {
            const urlParts = material.file_url.split('/');
            const filePath = urlParts.slice(urlParts.length - 2).join('/');
            // Prevent traversal by checking it starts with user id
            if (filePath.startsWith(`${req.user.id}/`)) {
                await req.supabase.storage.from('materials').remove([filePath]);
            }
        } catch (e) {
            console.error("Could not delete file", e);
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
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
