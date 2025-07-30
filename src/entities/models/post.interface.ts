export interface IPost {
  id: string;
  titulo: string;
  resumo?: string;
  conteudo: string;
  professor_id: number;
  created_at: Date;
  updated_at: Date;
}
