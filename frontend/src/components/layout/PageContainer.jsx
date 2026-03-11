const PageContainer = ({ children, className = ""})=>{
    return(
        <div className={`h-full w-full ${className}`}>
            {children}
        </div>
    )
}
export default PageContainer;