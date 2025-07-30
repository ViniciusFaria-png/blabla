import { PostRepository } from "@/repositories/pg/post.repository";
import { CreatePostUseCase } from "../create-post";

export function makeCreatePostUseCase() {
  const postRepository = new PostRepository();
  const useCase = new CreatePostUseCase(postRepository);

  return useCase;
}
