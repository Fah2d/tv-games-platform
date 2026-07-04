interface Props {
  value: number
}

export default function CountdownTimer({ value }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <p className="text-zinc-400 text-2xl mb-4 animate-pulse">استعدوا...</p>
      <p className="text-yellow-400 font-black text-9xl leading-none">
        {value}
      </p>
    </div>
  )
}
