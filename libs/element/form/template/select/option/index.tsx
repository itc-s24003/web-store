export function Option({ className, ...porps }: React.JSX.IntrinsicElements["option"]) {
    return (
        <option className={`p-2 border outline-none ${className}`} {...porps} />
    )
}