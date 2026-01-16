/**
 * Katha API Client
 * Handles all API calls with JWT authentication
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
export const BASE_URL = API_BASE.includes('http')
    ? API_BASE.replace('/api', '')
    : window.location.origin;

/**
 * Helper to get full URL for assets (images, audio, video)
 */
export const getAssetUrl = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    // If we're in local dev with vite proxy, we can use relative paths
    // but absolute is safer for Audio/Video elements.
    return `${BASE_URL}${cleanPath}`;
};

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Token storage keys
const TOKEN_KEY = 'katha_token'
const USER_KEY = 'user'

// Token management functions
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY)
}

export const getStoredUser = (): User | null => {
    const userStr = localStorage.getItem(USER_KEY)
    if (userStr) {
        try {
            return JSON.parse(userStr)
        } catch {
            return null
        }
    }
    return null
}

export const setStoredUser = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const removeStoredUser = (): void => {
    localStorage.removeItem(USER_KEY)
}

export const logout = (): void => {
    removeToken()
    removeStoredUser()
    window.location.href = '/login'
}

export const isAuthenticated = (): boolean => {
    return !!getToken()
}

// Request interceptor - add token to all requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken()
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor - handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            removeToken()
            removeStoredUser()
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/register') &&
                !window.location.pathname.includes('/onboarding')) {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

// Interfaces
export interface User {
    id: number
    name: string
    username?: string
    bio?: string
    profile_image_url?: string
    email?: string
    total_xp: number
    current_streak_days: number
    longest_streak_days: number
    stories_read: number
    archetype?: string
    created_at: string
}

export interface AuthResponse {
    user: User
    access_token: string
    token_type: string
    expires_in: number
    message: string
}

export interface Scene {
    id: number
    order: number
    chapter_id: number
    index: number
    raw_text: string
    original_text: string
    caption?: string
    symbolism?: string
    emotion?: string
    music_tag?: string
    image_url?: string
    ai_image_url?: string
    ai_video_url?: string
    ai_audio_url?: string
    audio_url?: string
    is_completed: boolean
    next_scene_id?: number
}

export interface Chapter {
    id: number
    story_id: number
    index: number
    title: string
    next_chapter_id?: number
    short_summary?: string
    cover_image_url?: string
    scenes?: Scene[]
}

export interface Story {
    id: number
    title: string
    slug?: string
    description?: string
    category?: string
    cover_image_url?: string
    total_chapters?: number
    total_scenes?: number
    chapters?: Chapter[]
}

export interface SceneCompleteResponse {
    xp_earned: number
    total_xp: number
    current_streak: number
    new_badges: any[]
}

// ==================== AUTH API ====================

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/users/register', { name, email, password })
    const data = response.data as AuthResponse

    // Store token and user
    setToken(data.access_token)
    setStoredUser(data.user)

    return data
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/users/login', { email, password })
    const data = response.data as AuthResponse

    // Store token and user
    setToken(data.access_token)
    setStoredUser(data.user)

    return data
}

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get('/users/me')
    const user = response.data as User
    setStoredUser(user)
    return user
}

export const updateCurrentUser = async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/users/me', data)
    const user = response.data.user as User
    setStoredUser(user)
    return user
}

// ==================== STORY API ====================

export const getStories = async (category?: string, query?: string): Promise<Story[]> => {
    const params: any = {}
    if (category && category !== "All") params.category = category
    if (query) params.q = query
    const res = await api.get("/stories/", { params })
    return res.data
}

export const getStoryDetail = async (id: number): Promise<Story> => {
    const res = await api.get(`/stories/${id}`)
    return res.data
}

export const getStoryWithChapters = async (id: number): Promise<Story> => {
    const res = await api.get(`/stories/${id}?include_chapters=true`)
    return res.data
}

// ==================== CHAPTER API ====================

export const getChapterScenes = async (chapterId: number): Promise<Scene[]> => {
    const res = await api.get(`/chapters/${chapterId}/scenes`)
    return res.data.map((s: any) => ({
        ...s,
        original_text: s.raw_text,
        order: s.index,
        is_completed: s.completed || false
    }))
}

export const getChapterDetail = async (chapterId: number): Promise<Chapter> => {
    const res = await api.get(`/chapters/${chapterId}`)
    return res.data
}

// ==================== SCENE API ====================

export const getScene = async (sceneId: number): Promise<Scene> => {
    const res = await api.get(`/scenes/${sceneId}/`)
    return {
        ...res.data,
        original_text: res.data.raw_text,
        order: res.data.index,
        is_completed: res.data.completed || false
    }
}

export const generateSceneContent = async (sceneId: number): Promise<Scene> => {
    const response = await api.post(`/scenes/${sceneId}/generate`)
    const data = response.data
    return {
        ...data,
        original_text: data.raw_text,
        order: data.index,
        is_completed: false
    }
}

export const generateScene = generateSceneContent

export const getReels = async (): Promise<Scene[]> => {
    const res = await api.get('/scenes/', { params: { has_video: true } })
    return res.data
}

export const completeScene = async (sceneId: number, userId: number): Promise<SceneCompleteResponse> => {
    const res = await api.post(`/scenes/${sceneId}/complete`, null, { params: { user_id: userId } })
    return res.data
}

// ==================== USER PROGRESS API ====================

export const getUserProgress = async (userId: number): Promise<Story[]> => {
    const response = await api.get(`/users/${userId}/progress`)
    return response.data
}

export const getUserFavorites = async (userId: number): Promise<Story[]> => {
    const response = await api.get(`/users/${userId}/favorites`)
    return response.data
}

export const toggleFavorite = async (userId: number, storyId: number): Promise<{ status: string; message: string }> => {
    const response = await api.post(`/users/${userId}/favorites/${storyId}`)
    return response.data
}

export const getUserCompleted = async (userId: number): Promise<Story[]> => {
    const response = await api.get(`/users/${userId}/completed`)
    return response.data
}

export const getUserProfile = async (userId: number): Promise<User> => {
    const response = await api.get(`/users/${userId}`)
    return response.data
}

// ==================== ACHIEVEMENTS API ====================

export const getAchievements = async (userId: number) => {
    const res = await api.get(`/user/${userId}/achievements`)
    return res.data
}

// ==================== AI GENERATION API ====================

export const generateImage = async (sceneId: number, prompt: string) => {
    const res = await api.post('/ai/image/generate/', { scene_id: sceneId, prompt })
    return res.data
}

export const generateVoice = async (sceneId: number, text: string, emotion?: string) => {
    const res = await api.post('/ai/voice/generate/', { scene_id: sceneId, text, emotion })
    return res.data
}

export const generateVideo = async (sceneId: number, prompt: string) => {
    const res = await api.post('/ai/video/generate/', { scene_id: sceneId, prompt })
    return res.data
}

export const generateAllAssets = async (sceneId: number, prompt: string, narration: string) => {
    const res = await api.post('/ai/pipeline/generate-all/', { scene_id: sceneId, prompt, narration })
    return res.data
}

export const generateChapterReel = async (chapterId: number) => {
    const res = await api.post(`/ai/reel/chapter/${chapterId}`)
    return res.data
}

// Chat with Rishi AI
export const askRishi = async (question: string, context: string) => {
    const res = await api.post('/ai/rishi/ask', { question, context })
    return res.data
}

// ==================== DEBUG API ====================

export const seedData = async () => {
    const res = await api.post("/debug/seed-data")
    return res.data
}

// ==================== LOCATIONS API ====================

export const getLocations = async () => {
    const res = await api.get('/locations/')
    return res.data
}
