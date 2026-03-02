export default function Env () {
  return <div>
    <pre>{ JSON.stringify(process.env.NEXT_PUBLIC_TEST_SECRET, 0, 2) }</pre>
  </div>
}
