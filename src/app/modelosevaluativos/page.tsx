

type Context = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function ModelosEvaluativosPage({ searchParams }:Context) {
    const section = searchParams.section

    if(section === '0') {
        return(
            <h1>section 1</h1>
        )
    }
    if(section === '1') {
        return(
            <h1>section 2</h1>
        )
    }
    if(section === '2') {
        return(
            <h1>section 3</h1>
        )
    }
    if(section === '3') {
        return(
            <h1>section 4</h1>
        )
    }


    return(
        <h1>section 1</h1>
    )
}