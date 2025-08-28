export const Loading = ({text = "cargando perfil"}: {text?:string}) => {
    return(
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">{text}...</p>
          </div>
        </div>
    )
}