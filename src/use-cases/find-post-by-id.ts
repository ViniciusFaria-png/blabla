import { IPost } from "@/entities/models/post.interface";
import { IPostRepository } from "@/repositories/post.repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface FindPostByIdUseCaseRequest {
  postId: string;
}

interface FindPostByIdUseCaseResponse {
  post: IPost;
}

export class FindPostByIdUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute({
    postId,
  }: FindPostByIdUseCaseRequest): Promise<FindPostByIdUseCaseResponse> {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      throw new ResourceNotFoundError();
    }

    return {
      post,
    };
  }
}
