export function AppView({ className, ...props }: React.JSX.IntrinsicElements["div"]) {
    return (
        <div
            className={
                [
                    "flex flex-col w-full max-h-full flex-1 overflow-hidden",
                    className ?? ""
                ].join(" ")
            }
            {...props}
        />
    )
}