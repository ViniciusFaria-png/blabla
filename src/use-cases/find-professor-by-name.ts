import { IProfessorRepository } from "@/repositories/professor.repository.interface";

export class FindProfessorByNameUseCase {
  constructor(private readonly professorRepository: IProfessorRepository) {}

  async handler(id: number) {
    return this.professorRepository.getName(id);
  }

  async getProfessorId(userId: number) {
    return this.professorRepository.getProfessorId(userId);
  }

  async findByUserId(userId: number) {
    return this.professorRepository.findByUserId(userId);
  }
}