import { IPost } from "@/entities/models/post.interface";
import { IPostRepository } from "@/repositories/post.repository.interface";

interface CreatePostUseCaseRequest {
  titulo: string;
  resumo?: string;
  conteudo: string;
  professor_id: number;
}

interface CreatePostUseCaseResponse {
  post: IPost;
}

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute({
    titulo,
    resumo,
    conteudo,
    professor_id,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const post = await this.postRepository.create({
      titulo,
      resumo,
      conteudo,
      professor_id,
    });

    if (!post) {
      throw new Error("Failed to create post.");
    }

    return {
      post,
    };
  }
}
