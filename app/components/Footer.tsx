export default function Footer(props: { children?: string }) {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-[1850px] px-6 py-8 text-center">
        <h3 className="font-semibold leading-6 text-white">{props.children}</h3>
        <p className="text-sm leading-6 text-gray-300">Gratitud.</p>
      </div>
    </footer>
  )
}
