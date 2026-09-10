import Image from "next/image";
import { Header } from "@/components/header";
import { PageMotion } from "@/components/page-motion";
import { MotionDirector } from "@/components/motion-director";
import { DesktopPhoto } from "@/components/desktop-photo";
import {
  BookingButton,
  BookingProvider,
  MobileBookingBar,
} from "@/components/booking";
import { Arrow } from "@/components/icons";
import { services, stylists, faqs, priceLabel, salon } from "@/lib/salon";

const assetBasePath = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
  : "";

export default function Home() {
  const image = (path: string) => `${assetBasePath}${path}`;
  return (
    <BookingProvider>
      <a className="skip-link" href="#noi-dung">
        Đến nội dung chính
      </a>
      <div id="dau-trang" />
      <Header />
      <PageMotion />
      <MotionDirector />
      <main id="noi-dung">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-label">
              <span />
              Sol. Hair Studio
              <span className="concept-badge">Bản concept</span>
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
              <BookingButton id="hero-booking" />
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
            <div className="hero-scene">
              <div className="hero-layer hero-layer-back" aria-hidden="true">
                <div className="hero-depth"><div className="hero-arrival"><div className="hero-photo-plane">
                  <DesktopPhoto src={image("/images/motion/hero-back.webp")} width={560} height={840} eager />
                </div></div></div>
              </div>
              <div className="hero-layer hero-layer-main">
                <div className="hero-depth"><div className="hero-arrival"><div className="hero-photo-plane">
            <div className="hero-image">
              <Image
                src={image("/images/hero.webp")}
                alt="Khách đang được tạo kiểu tóc trong không gian salon sáng dịu, ảnh minh họa"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                preload
              />
              <span className="image-label">CẮT · TẠO KIỂU · CHĂM SÓC</span>
            </div>
                </div></div></div>
              </div>
              <div className="hero-layer hero-layer-front" aria-hidden="true">
                <div className="hero-depth"><div className="hero-arrival"><div className="hero-photo-plane">
                  <DesktopPhoto src={image("/images/motion/hero-detail.webp")} width={600} height={720} eager />
                </div></div></div>
              </div>
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
                <h2 id="services-title">Dịch vụ & giá</h2>
              </div>
              <div className="section-intro">
                <p>
                  Chọn điều vừa vặn với mái tóc bạn.
                </p>
                <p className="small-note">Bảng giá minh họa</p>
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
              <h2 id="team-title">Đội ngũ tại Sol</h2>
            </div>
            <div className="section-intro">
              <p>
                Ba cá tính, cùng bắt đầu bằng việc lắng nghe.
              </p>
              <p className="small-note">
                Nhân sự giả lập · Ảnh chân dung minh họa.
              </p>
            </div>
          </div>
          <div className="team-grid">
            {stylists.map((stylist, index) => (
              <article className="team-member" key={stylist.id}>
                <div className={`team-photo team-photo-${index}`} data-reveal={index}>
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
          <div className="container gallery-pin">
            <div className="section-heading">
              <div>
                <h2 id="inspiration-title">Cảm hứng cho mái tóc</h2>
              </div>
              <div className="section-intro">
                <p>
                  Gọn gàng, mềm mại hay thêm chút sắc màu?
                </p>
                <p className="small-note">
                  Ảnh tham khảo · Không phải tác phẩm của Sol.
                </p>
              </div>
            </div>
            <div className="spatial-gallery">
              <div className="gallery-stage" aria-label="Năm gợi ý kiểu tóc">
                {[
                  ["hair-bob.webp", "Bob gọn, nét riêng", "Cắt & tạo dáng", "Tóc bob đen với mái bằng"],
                  ["hair-waves.webp", "Sóng mềm tự nhiên", "Uốn & tạo kiểu", "Mái tóc nâu uốn sóng nhẹ"],
                  ["hair-color.webp", "Thêm một sắc màu", "Nhuộm màu", "Mái tóc dài chuyển sắc nâu sáng"],
                  ["motion/hair-short.webp", "Nét cắt thanh thoát", "Cắt & tạo dáng", "Tóc bob nâu ngắn nhìn nghiêng trên nền trắng"],
                  ["motion/hair-long.webp", "Dài mềm, tự nhiên", "Chăm sóc & tạo kiểu", "Mái tóc nâu dài dưới ánh sáng tự nhiên"],
                ].map(([src, title, detail, alt], index) => (
                  <figure className="gallery-frame" data-title={title} data-detail={detail} key={src}>
                    <div className="gallery-photo">
                      <DesktopPhoto src={image(`/images/${src}`)} alt={`${alt}, ảnh tham khảo`} width={760} height={1000} />
                    </div>
                    <figcaption><span>{title}</span><span>{detail}</span></figcaption>
                    <span className="sr-only">Ảnh {index + 1} trong 5</span>
                  </figure>
                ))}
              </div>
              <div className="gallery-controls">
                <div className="gallery-current" aria-live="off" aria-atomic="true">
                  <strong data-gallery-title>Bob gọn, nét riêng</strong>
                  <span data-gallery-detail>Cắt & tạo dáng</span>
                </div>
                <div className="gallery-navigation" role="group" aria-label="Chuyển ảnh kiểu tóc">
                  <button type="button" className="icon-button gallery-previous" aria-label="Kiểu tóc trước"><Arrow /></button>
                  <span className="gallery-count" aria-hidden="true"><span data-gallery-index>01</span> / 05</span>
                  <button type="button" className="icon-button gallery-next" aria-label="Kiểu tóc tiếp theo"><Arrow /></button>
                </div>
                <a href="#khong-gian" className="gallery-skip text-link">Bỏ qua gallery <Arrow /></a>
                <div className="gallery-progress" aria-hidden="true"><span /></div>
              </div>
            </div>
            <div className="inspiration-grid">
              <figure className="style-figure style-bob" data-reveal="0">
                <div className="style-image">
                  <Image
                    src={image("/images/hair-bob.webp")}
                    alt="Tóc bob đen với mái bằng, ảnh gợi ý phong cách"
                    fill
                    sizes="(max-width: 767px) 100vw, 40vw"
                  />
                </div>
                <figcaption>
                  <span>Bob gọn, nét riêng</span>
                  <span>Cắt & tạo dáng</span>
                </figcaption>
              </figure>
              <figure className="style-figure style-waves" data-reveal="1">
                <div className="style-image">
                  <Image
                    src={image("/images/hair-waves.webp")}
                    alt="Mái tóc nâu uốn sóng nhẹ dưới ánh sáng cửa sổ, ảnh gợi ý"
                    fill
                    sizes="(max-width: 767px) 50vw, 30vw"
                  />
                </div>
                <figcaption>
                  <span>Sóng mềm tự nhiên</span>
                  <span>Uốn & tạo kiểu</span>
                </figcaption>
              </figure>
              <figure className="style-figure style-color" data-reveal="2">
                <div className="style-image">
                  <Image
                    src={image("/images/hair-color.webp")}
                    alt="Mái tóc dài chuyển sắc nâu sáng, ảnh gợi ý màu tóc"
                    fill
                    sizes="(max-width: 767px) 50vw, 30vw"
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
            <div className="space-ribbons" aria-label="Những góc salon tham khảo">
              {[
                [["interior.webp", "Góc gội tóc sáng dịu"], ["motion/space-care.webp", "Thao tác gội và chăm sóc tóc"]],
                [["motion/space-mirror.webp", "Góc gương và ghế tạo kiểu"], ["motion/space-styling.webp", "Thao tác làm tóc trong salon"]],
              ].map((photos, column) => (
                <div className={`ribbon-column ribbon-column-${column}`} key={column}>
                  <div className="ribbon-track">
                    {[0, 1, 2].map((copy) => (
                      <div className="ribbon-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
                        {photos.map(([src, alt]) => <div className="ribbon-photo" key={src}>
                          <DesktopPhoto src={image(`/images/${src}`)} alt={copy === 0 ? `${alt}, ảnh stock minh họa` : ""} width={600} height={800} />
                        </div>)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-image">
              <Image
                src={image("/images/interior.webp")}
                alt="Góc gội tóc sáng dịu với ghế ngồi và cây xanh; ảnh stock minh họa"
                fill
                sizes="(max-width: 767px) 100vw, 55vw"
              />
            </div>
            <figcaption>
              Không gian tham khảo · Ảnh stock
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
                Hẹn bạn ở Sol.
              </h2>
              <p className="visit-intro">
                Một vài thông tin để bạn dễ sắp xếp.
              </p>
              <dl className="visit-details">
                <div>
                  <dt>Giờ mở cửa</dt>
                  <dd>
                    {salon.hours}
                    <span>Thứ Hai đến Chủ Nhật</span>
                  </dd>
                </div>
                <div>
                  <dt>Khu vực dự kiến</dt>
                  <dd>
                    {salon.area}
                  </dd>
                </div>
              </dl>
              <p className="small-note">
                Địa điểm và giờ minh họa · Chưa có salon thực tế.
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
        <section className="final-cta container" id="dat-lich" aria-labelledby="final-title">
          <div>
            <h2 id="final-title">
              Một lịch hẹn dành cho bạn.
            </h2>
            <p>Dành một chút thời gian cho mình, cùng Sol.</p>
          </div>
          <div className="final-action">
            <BookingButton />
            <span>Lịch mẫu · Không giữ chỗ</span>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <a
            href="#dau-trang"
            className="brand"
            translate="no"
            aria-label="Sol. Hair Studio — về đầu trang"
          >
            <span className="wordmark">
              Sol<span className="wordmark-dot">.</span>
            </span>
            <span className="brand-label">HAIR STUDIO</span>
          </a>
          <p>
            Bản thiết kế thử nghiệm. Thương hiệu, dịch vụ và thông tin vận hành mang tính minh họa.
            Ảnh stock không phải nhân sự, tác phẩm hay mặt bằng thật của Sol.
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
