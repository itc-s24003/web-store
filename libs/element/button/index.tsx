export function Button({className, ...props}: React.JSX.IntrinsicElements["button"]) {
    return (
        <button
            className={`cursor-pointer ${className}`}
            {...props}
        />
    )
}