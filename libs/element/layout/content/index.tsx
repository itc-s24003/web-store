export function Content({ className, ...props }: React.JSX.IntrinsicElements["div"]) {
    return (
        <div
            className={
                [
                    "flex-1 flex flex-col bg-(--container-background-sub) text-(--text-color) overflow-y-auto pb-8 px-4 overflow-x-hidden",
                    className
                ].join(" ")
            }
            {...props}
        />
    )
}