import { PostRepository } from "@/repositories/pg/post.repository";
import { SearchQueryStringUseCase } from "../search-post";

export function makeSearchPostUseCase() {
  const postRepository = new PostRepository();
  const useCase = new SearchQueryStringUseCase(postRepository);

  return useCase;
}
