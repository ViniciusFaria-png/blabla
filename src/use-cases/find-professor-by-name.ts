import { IProfessorRepository } from "@/repositories/professor.repository.interface";

export class FindProfessorByNameUseCase {
  constructor(private readonly professorRepository: IProfessorRepository) {}

  async handler(id: number) {
    return this.professorRepository.getName(id);
  }
}
