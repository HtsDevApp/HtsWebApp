export interface Database {
  public: {
    Tables: {
      app_users: {
        Row: {
          id: number
          username: string
          password?: string // Make optional in Row to avoid leaking it if not needed
          role: string | null
          empresa_id: number | null
          created_at: string | null
        }
        Insert: {
          username: string
          password?: string 
          role?: string | null
          empresa_id?: number | null
          created_at?: string
        }
        Update: {
          username?: string
          password?: string
          role?: string | null
          empresa_id?: number | null
          created_at?: string
        }
      }
      content_page: {
        Row: {
          id: number
          title: string | null
          slug: string
          content: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          title?: string | null
          slug: string
          content?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          title?: string | null
          slug?: string
          content?: string | null
          updated_at?: string | null
        }
      }
      empresa: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: number
          nombre: string
        }
        Update: {
          id?: number
          nombre?: string
        }
      }
    }
  }
}