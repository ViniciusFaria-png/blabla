import { PostRepository } from "@/repositories/pg/post.repository";
import { FindPostByIdUseCase } from "../find-post-by-id";

export function makeFindPostByIdUseCase() {
  const postRepository = new PostRepository();
  const useCase = new FindPostByIdUseCase(postRepository);

  return useCase;
}
