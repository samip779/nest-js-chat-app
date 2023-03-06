export type CreateUserDetails = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
};

export type CreateMessageDetails = {
  sender_id: number;
  receiver_id: number;
  text: string;
};
