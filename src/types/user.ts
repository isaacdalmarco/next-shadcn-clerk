/**
 * Tipo para dados do usuário do Clerk
 */
export interface ClerkUser {
  id: string;
  emailAddresses: Array<{
    emailAddress: string;
  }>;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

/**
 * Tipo para criação de usuário (não mais necessário com Clerk)
 * Mantido para compatibilidade com componentes existentes
 */
export interface CreateUserInput {
  email: string;
  name?: string;
  avatar?: string;
}

/**
 * Tipo para atualização de usuário (não mais necessário com Clerk)
 * Mantido para compatibilidade com componentes existentes
 */
export interface UpdateUserInput {
  email?: string;
  name?: string;
  avatar?: string;
}
