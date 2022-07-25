interface Props {
  message?: string;
}

export function Error({ message }: Props) {
  return <p>Error: {message}</p>;
}
