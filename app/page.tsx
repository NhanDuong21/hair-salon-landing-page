import Image from "next/image";
import { Header } from "@/components/header";
import {
  BookingButton,
  BookingProvider,
  MobileBookingBar,
} from "@/components/booking";
import { Arrow } from "@/components/icons";
import { services, stylists, faqs, priceLabel, salon } from "@/lib/salon";

export default function Home() {
  return (
    <BookingProvider>
      <a className="skip-link" href="#noi-dung">
        Đến nội dung chính
      </a>
      <div id="dau-trang" />
      <Header />
      <main id="noi-dung">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-label">
              <span />
              Sol. Hair Studio
            </p>
            <h1 id="hero-title">
              Tóc đẹp,
              <br />
              bắt đầu từ
              <br />
              <em>một lịch hẹn.</em>
            </h1>
            <p className="hero-description">{salon.description}</p>
            <div className="hero-actions">
              <BookingButton />
              <a className="text-link" href="#dich-vu">
                Xem dịch vụ & giá
                <Arrow />
              </a>
            </div>
            <div className="hero-note">
              <span className="little-line" />
              Một mái tóc hợp bạn. Một khoảng thời gian cho mình.
            </div>
          </div>
          <figure className="hero-figure">
            <div className="hero-image">
              <Image
                src="/images/hero.webp"
                alt="Khách đang được tạo kiểu tóc trong không gian salon sáng dịu, ảnh minh họa"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                preload
              />
              <span className="image-label">CẮT · TẠO KIỂU · CHĂM SÓC</span>
            </div>
            <figcaption>
              Chậm lại một chút. Để Sol chăm chút mái tóc bạn.
              <span>Ảnh minh họa</span>
            </figcaption>
          </figure>
        </section>
        <section
          className="services-section section"
          id="dich-vu"
          tabIndex={-1}
          aria-labelledby="services-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <h2 id="services-title">
                  Một lựa chọn vừa vặn
                  <br />
                  <em>với mái tóc bạn.</em>
                </h2>
              </div>
              <div className="section-intro">
                <p>
                  Từ một lần cắt gọn đến một màu tóc mới.
                  <br />
                  Xem giá, dành thời gian, rồi chọn điều bạn cần.
                </p>
                <p className="small-note">Dịch vụ & giá minh họa</p>
              </div>
            </div>
            <div className="service-table">
              <div className="service-table-head" aria-hidden="true">
                <span>Dịch vụ</span>
                <span>Thời lượng</span>
                <span>Giá</span>
                <span />
              </div>
              {services.map((service) => (
                <article className="service-row" key={service.id}>
                  <div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <span className="service-duration">
                    {service.duration} phút
                  </span>
                  <strong className="service-price">
                    {priceLabel(service)}
                  </strong>
                  <BookingButton
                    serviceId={service.id}
                    className="service-select"
                  >
                    <span>
                      Chọn<span className="sr-only"> {service.name}</span>
                    </span>
                  </BookingButton>
                </article>
              ))}
            </div>
            <p className="pricing-note">
              Giá “từ” tùy độ dài, nền tóc và kỹ thuật. Thời lượng là ước tính;
              chi tiết sẽ được trao đổi trước khi thực hiện.
            </p>
          </div>
        </section>
        <section
          className="team-section section container"
          id="doi-ngu"
          tabIndex={-1}
          aria-labelledby="team-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="team-title">
                Gặp người sẽ
                <br />
                <em>chăm chút tóc bạn.</em>
              </h2>
            </div>
            <div className="section-intro">
              <p>
                Mỗi người một thế mạnh.
                <br />
                Cùng bắt đầu bằng việc lắng nghe bạn.
              </p>
              <p className="small-note">
                Nhân sự giả lập. Ảnh chân dung minh họa,
                <br />
                không phải nhân viên thực tế của Sol.
              </p>
            </div>
          </div>
          <div className="team-grid">
            {stylists.map((stylist, index) => (
              <article className="team-member" key={stylist.id}>
                <div className={`team-photo team-photo-${index}`}>
                  <Image
                    src={stylist.image}
                    alt={`Ảnh stock minh họa cho nhân sự giả lập ${stylist.name}`}
                    fill
                    sizes="(max-width: 599px) 42vw, (max-width: 1100px) 30vw, 380px"
                  />
                </div>
                <div className="team-copy">
                  <div className="team-name-row">
                    <h3>{stylist.name}</h3>
                    <BookingButton
                      stylistId={stylist.id}
                      className="team-select"
                      arrow={false}
                    >
                      Chọn {stylist.name}
                      <Arrow width="18" height="18" />
                    </BookingButton>
                  </div>
                  <p className="team-role">{stylist.role}</p>
                  <p className="team-description">{stylist.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="inspiration-section section"
          aria-labelledby="inspiration-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <h2 id="inspiration-title">
                  Một chút cảm hứng.
                  <br />
                  <em>Một phiên bản rất bạn.</em>
                </h2>
              </div>
              <div className="section-intro">
                <p>
                  Gọn gàng, mềm mại hay thêm chút sắc màu?
                  <br />
                  Bắt đầu từ một kiểu tóc khiến bạn thấy thích.
                </p>
                <p className="small-note">
                  Ảnh gợi ý phong cách, không phải tác phẩm của Sol.
                </p>
              </div>
            </div>
            <div className="inspiration-grid">
              <figure className="style-figure style-bob">
                <div className="style-image">
                  <Image
                    src="/images/hair-bob.webp"
                    alt="Tóc bob đen với mái bằng, ảnh gợi ý phong cách"
                    fill
                    sizes="(max-width: 599px) 55vw, 40vw"
                  />
                </div>
                <figcaption>
                  <span>Bob gọn, nét riêng</span>
                  <span>Cắt & tạo dáng</span>
                </figcaption>
              </figure>
              <figure className="style-figure style-waves">
                <div className="style-image">
                  <Image
                    src="/images/hair-waves.webp"
                    alt="Mái tóc nâu uốn sóng nhẹ dưới ánh sáng cửa sổ, ảnh gợi ý"
                    fill
                    sizes="(max-width: 599px) 45vw, 30vw"
                  />
                </div>
                <figcaption>
                  <span>Sóng mềm tự nhiên</span>
                  <span>Uốn & tạo kiểu</span>
                </figcaption>
              </figure>
              <figure className="style-figure style-color">
                <div className="style-image">
                  <Image
                    src="/images/hair-color.webp"
                    alt="Mái tóc dài chuyển sắc nâu sáng, ảnh gợi ý màu tóc"
                    fill
                    sizes="(max-width: 599px) 55vw, 30vw"
                  />
                </div>
                <figcaption>
                  <span>Thêm một sắc màu</span>
                  <span>Nhuộm màu</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
        <section
          className="space-section section container"
          id="khong-gian"
          tabIndex={-1}
          aria-labelledby="space-title"
        >
          <figure className="space-figure">
            <div className="space-image">
              <Image
                src="/images/interior.webp"
                alt="Không gian salon với gương tròn, ghế làm tóc và cây xanh; ảnh stock minh họa"
                fill
                sizes="(max-width: 767px) 100vw, 55vw"
              />
            </div>
            <figcaption>
              Hình dung không gian tại Sol · Ảnh stock minh họa
            </figcaption>
          </figure>
          <div className="space-copy">
            <h2 id="space-title">
              Ghé Sol.
              <br />
              <em>Thảnh thơi một chút.</em>
            </h2>
            <p>
              Một góc sáng, một chiếc ghế thoải mái, một cuộc trò chuyện về mái
              tóc bạn muốn.
            </p>
            <p>
              Sol được hình dung là nơi bạn có thể tạm gác nhịp vội, dành thời
              gian cho tóc và cho mình.
            </p>
            <div className="space-detail">
              <span>Ánh sáng dịu</span>
              <span>Không gian thoáng</span>
              <span>Chăm chút từng nếp tóc</span>
            </div>
            <BookingButton className="text-link space-booking">
              Chọn một lịch hẹn
            </BookingButton>
          </div>
        </section>
        <section
          className="visit-section section"
          id="lien-he"
          tabIndex={-1}
          aria-labelledby="visit-title"
        >
          <div className="container visit-grid">
            <div className="visit-copy">
              <h2 id="visit-title">
                Hẹn bạn <em>ở Sol.</em>
              </h2>
              <p className="visit-intro">
                Một vài điều để bạn dễ sắp xếp
                <br />
                trước khi ghé tiệm.
              </p>
              <dl className="visit-details">
                <div>
                  <dt>Giờ mở cửa mẫu</dt>
                  <dd>
                    {salon.hours}
                    <span>Thứ Hai đến Chủ Nhật</span>
                  </dd>
                </div>
                <div>
                  <dt>Khu vực minh họa</dt>
                  <dd>
                    {salon.area}
                    <span>Chưa có địa chỉ salon thực tế.</span>
                  </dd>
                </div>
              </dl>
              <p className="small-note">
                Thông tin vận hành minh họa cho bản concept.
              </p>
            </div>
            <div className="faq">
              <h3>Một vài điều bạn muốn biết</h3>
              {faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>
                    {faq.question}
                    <span className="faq-plus" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="final-cta container" aria-labelledby="final-title">
          <div>
            <h2 id="final-title">
              Một mái tóc mới.
              <br />
              <em>Bắt đầu bằng một lịch hẹn.</em>
            </h2>
            <p>Dành một chút thời gian cho mình, cùng Sol.</p>
          </div>
          <div className="final-action">
            <BookingButton />
            <span>Trải nghiệm demo · Chưa tạo lịch hẹn thật</span>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <a
            href="#dau-trang"
            className="brand"
            aria-label="Sol. Hair Studio — về đầu trang"
          >
            <span className="wordmark">
              Sol<span className="wordmark-dot">.</span>
            </span>
            <span className="brand-label">HAIR STUDIO</span>
          </a>
          <p>
            Bản thiết kế thử nghiệm. Thương hiệu, dịch vụ và thông tin
            <br className="desktop-break" /> vận hành mang tính minh họa.
          </p>
          <a className="footer-top" href="#dau-trang">
            Về đầu trang
            <Arrow />
          </a>
        </div>
      </footer>
      <MobileBookingBar />
    </BookingProvider>
  );
}
