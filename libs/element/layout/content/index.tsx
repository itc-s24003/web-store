export function Content({ className, children, ...props }: React.JSX.IntrinsicElements["div"]) {
    return (
        <div
            className="flex-1 flex flex-col bg-(--container-background) overflow-y-auto pb-8 px-4"
            {...props}
        >
            {children}
        </div>
    )
}