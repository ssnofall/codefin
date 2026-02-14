export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string
          joined_at: string
          score: number
        }
        Insert: {
          id: string
          username: string
          avatar_url: string
          joined_at?: string
          score?: number
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string
          joined_at?: string
          score?: number
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          code: string
          language: string
          file_name: string | null
          tags: string[]
          created_at: string
          upvotes: number
          downvotes: number
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          code: string
          language: string
          file_name?: string | null
          tags?: string[]
          created_at?: string
          upvotes?: number
          downvotes?: number
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          code?: string
          language?: string
          file_name?: string | null
          tags?: string[]
          created_at?: string
          upvotes?: number
          downvotes?: number
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          type: 'up' | 'down'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          type: 'up' | 'down'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          type?: 'up' | 'down'
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          body?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
