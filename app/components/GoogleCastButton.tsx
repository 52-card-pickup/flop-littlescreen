declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            "google-cast-launcher": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}

export function GoogleCastButton(props: React.HTMLProps<HTMLDivElement>) {
    return (
        <div {...props}>
            <div className="flex justify-center items-center h-full w-full max-w-[48px] max-h-[48px]">
                <google-cast-launcher id="castbutton"></google-cast-launcher>
            </div>
        </div>
    );
}
