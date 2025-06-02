export interface ImageProp {
    cgi: string[],
    img: string[],
    dim: string[]
}

export interface ImageRequestDto {
    id: number,
    images: ImageProp,
}