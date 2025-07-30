import { IPostRepository } from "@/repositories/post.repository.interface";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeletePostUseCaseRequest {
  postId: string;
}

type DeletePostUseCaseResponse = void;

export class DeletePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute({
    postId,
  }: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse> {
    const postExists = await this.postRepository.findById(postId);

    if (!postExists) {
      throw new ResourceNotFoundError();
    }

    await this.postRepository.delete(postId);
  }
}
