import { IPost } from "@/entities/models/post.interface";
import { IPostRepository } from "@/repositories/post.repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface UpdatePostUseCaseRequest {
  postId: string;
  titulo?: string;
  resumo?: string;
  conteudo?: string;
  professor_id?: number;
}

interface UpdatePostUseCaseResponse {
  post: IPost;
}

export class UpdatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute({
    postId,
    ...data
  }: UpdatePostUseCaseRequest): Promise<UpdatePostUseCaseResponse> {
    const post = await this.postRepository.update(postId, data);

    if (!post) {
      throw new ResourceNotFoundError();
    }

    return {
      post,
    };
  }
}
