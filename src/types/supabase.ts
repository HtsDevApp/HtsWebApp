export interface Database {
  public: {
    Tables: {
      app_users: {
        Row: {
          id: number
          username: string
          role: string | null
          empresa_id: number | null
          created_at: string | null
        }
        Insert: {
          username: string
          password?: string 
          role?: string | null
          empresa_id?: number | null
          // id and created_at are optional because the DB generates them
        }
        Update: {
          username?: string
          password?: string
          role?: string | null
          empresa_id?: number | null
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
          id?: number // Optional: DB generates it
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