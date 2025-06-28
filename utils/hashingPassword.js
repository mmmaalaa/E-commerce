import bcrypt from "bcryptjs";

export const hashPassword = async(password, saltRounds = Number(process.env.SALTROUNDS)) => {
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return hashPassword;
}

export const comparePassword = async(password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}