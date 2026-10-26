export function Textarea({ className, ...porps }: React.JSX.IntrinsicElements["textarea"]) {
    return (
        <textarea className={`p-2 border outline-none ${className}`} {...porps} />
    )
}