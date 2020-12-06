export default function Layout({ children }) {
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center ">
        <main className="h-full w-full">{children}</main>
      </div>
    </>
  );
}
