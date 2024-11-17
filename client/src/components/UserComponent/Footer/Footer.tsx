import './Footer.css'

const Footer = () =>{

    return(
        <footer>
        <div className="footer-content">
          <div className="quick-links">
            <a href="/home">Home</a>
            <a href="/movies">Movies</a>
            <a href="/theaters">Theaters</a>
            <a href="/offers">Offers</a>
            <a href="/contact">Contact Us</a>
          </div>
          <div className="social-icons">
            <a href="https://facebook.com">Facebook</a>
            <a href="https://twitter.com">Twitter</a>
            <a href="https://instagram.com">Instagram</a>
          </div>

          <p>&copy; 2024 Cinema Ticket Booking. All rights reserved.</p>
        </div>
      </footer>
    )
}

export default Footer;