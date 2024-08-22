
function Header() {
  return (
    <div className="l-header__brand">
        <div>
            <h1 className="l-header__logo">
            <a href="https://design-library.jp/ui/">
                <img src={`${process.env.PUBLIC_URL}/05-1.png`} alt="Sample" className="resized-image" />
            </a>
            </h1>
            <p className="l-header__lead">高大接続 地域課題解決型AI教育プログラム</p>
        </div>
    </div>
  );
}

export default Header;