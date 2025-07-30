import { IPostRepository } from "@/repositories/post.repository.interface";

export class SearchQueryStringUseCase {
  constructor(private postRepository: IPostRepository) {}

  handler(query: string) {
    return this.postRepository.searchQueryString(query);
  }
}
