import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState, UiState, VoiceSession, VoiceMessage } from '@/types';

// Auth store
interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// UI store
interface UiStore extends UiState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,
      sidebarOpen: false,
      theme: 'auto',

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen });
      },

      setTheme: (theme: 'light' | 'dark' | 'auto') => {
        set({ theme });
        // Apply theme to document
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // auto theme - respect system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Voice interaction store
interface VoiceStore {
  currentSession: VoiceSession | null;
  isRecording: boolean;
  isPlaying: boolean;
  startSession: (assistantId: string) => void;
  endSession: () => void;
  setRecording: (recording: boolean) => void;
  setPlaying: (playing: boolean) => void;
  addMessage: (message: VoiceMessage) => void;
}

export const useVoiceStore = create<VoiceStore>((set, get) => ({
  currentSession: null,
  isRecording: false,
  isPlaying: false,

  startSession: (assistantId: string) => {
    const session: VoiceSession = {
      id: crypto.randomUUID(),
      assistantId,
      userId: useAuthStore.getState().user?.id || '',
      messages: [],
      status: 'active',
      startTime: new Date(),
    };
    set({ currentSession: session });
  },

  endSession: () => {
    const session = get().currentSession;
    if (session) {
      set({
        currentSession: {
          ...session,
          status: 'completed',
          endTime: new Date(),
        },
      });
    }
  },

  setRecording: (recording: boolean) => {
    set({ isRecording: recording });
  },

  setPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  addMessage: (message: VoiceMessage) => {
    const session = get().currentSession;
    if (session) {
      set({
        currentSession: {
          ...session,
          messages: [...session.messages, message],
        },
      });
    }
  },
}));
