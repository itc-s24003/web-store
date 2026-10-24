export function Content({ className, children, ...props }: React.JSX.IntrinsicElements["div"]) {
    return (
        <div
            className="flex-1 bg-(--container-background) overflow-y-auto"
            {...props}
        >
            <div className={`pb-6 px-4 ${className}`}>
                {children}
            </div>
        </div>
    )
}