import { IPost } from "@/entities/models/post.interface";
import { IPostRepository } from "@/repositories/post.repository.interface";

interface FindAllPostsUseCaseResponse {
  posts: IPost[];
}

export class FindAllPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(): Promise<FindAllPostsUseCaseResponse> {
    const posts = await this.postRepository.findAll();

    return {
      posts,
    };
  }
}
