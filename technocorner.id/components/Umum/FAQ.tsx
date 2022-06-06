import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { dataCP } from "../../data/dataCP";

export default function FAQ(props: any) {
  const list = dataCP.filter((items) => items.name == props.name);

  const disclosureContainerCSS =
    "my-6 shadow-lg shadow-cstmgray/50 bg-gradient-to-r from-cstmglass2 to-cstmglass rounded-lg";
  const disclosureButtonCSS =
    "flex justify-between w-full px-4 py-2 text-xs md:text-sm xl:text-base 2xl:text-lg font-gothammedium text-left focus:outline-none ";
  const disclosurePanelCSS =
    "px-4 pt-4 pb-2 text-xs xl:text-sm 2xl:text-base 2xl:text-lg font-gothambook";
  const openPanelChevronIconCSS = "transform rotate-180";
  const ChevronIconCSS = "w-5 h-5 text-cstmdarkergreen";

  return (
    <>
      <div
        data-aos="fade-up"
        className="overflow-x-hidden bg-cstmwhite px-4 md:px-24 lg:px-36 pt-12 md:pt-16 xl:pt-20"
      >
        <div className="font-mechano text-sm md:text-lg lg:text-2xl 2xl:text-3xl text-center pb-2 sm:pb-4 md:pb-6">
          Pertanyaan Umum (FAQ)
        </div>
        {/* F A Q KSK */}
        <div>
          <Disclosure as="div" className={disclosureContainerCSS}>
            {({ open }) => (
              <>
                <Disclosure.Button className={disclosureButtonCSS}>
                  <span>Bagaimana cara mendaftar?</span>
                  <ChevronDownIcon
                    className={`${
                      open ? openPanelChevronIconCSS : ""
                    } ${ChevronIconCSS}`}
                  />
                </Disclosure.Button>
                {open && (
                  <Disclosure.Panel static className={disclosurePanelCSS}>
                    <span>
                      Untuk mendaftar dapat membuat akun pada website
                      Technocorner 2022 dan mengikuti alur pendaftaran
                    </span>
                    <span>
                      <a
                        className="text-cstmred"
                        href="https://link.technocorner.id/AlurPendaftaran"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {" "}
                        di sini
                      </a>
                      .
                    </span>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
          <Disclosure as="div" className={disclosureContainerCSS}>
            {({ open }) => (
              <>
                <Disclosure.Button className={disclosureButtonCSS}>
                  <span>
                    Bagaimana jika belum memiliki KTM (Kartu Tanda Mahasiswa)?
                  </span>
                  <ChevronDownIcon
                    className={`${
                      open ? openPanelChevronIconCSS : ""
                    } ${ChevronIconCSS}`}
                  />
                </Disclosure.Button>
                {open && (
                  <Disclosure.Panel static className={disclosurePanelCSS}>
                    <span>
                      Diperbolehkan untuk menggunakan e-KTM (dari website
                      universitas), KTP, atau identitas lainnya. Untuk pelajar
                      dapat menggunakan kartu pelajar.
                    </span>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
          <Disclosure as="div" className={disclosureContainerCSS}>
            {({ open }) => (
              <>
                <Disclosure.Button className={disclosureButtonCSS}>
                  <span>Foto profil pada identitas harus diisi apa?</span>
                  <ChevronDownIcon
                    className={`${
                      open ? openPanelChevronIconCSS : ""
                    } ${ChevronIconCSS}`}
                  />
                </Disclosure.Button>
                {open && (
                  <Disclosure.Panel static className={disclosurePanelCSS}>
                    <span>
                      Isi dengan foto diri, bebas baik formal maupun tidak,
                      dengan menampakkan wajah dengan jelas.
                    </span>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
          <Disclosure as="div" className={disclosureContainerCSS}>
            {({ open }) => (
              <>
                <Disclosure.Button className={disclosureButtonCSS}>
                  <span>
                    Apakah bisa untuk mendaftarkan lebih dari satu tim
                    menggunakan satu akun yang sama?
                  </span>
                  <ChevronDownIcon
                    className={`${
                      open ? openPanelChevronIconCSS : ""
                    } ${ChevronIconCSS}`}
                  />
                </Disclosure.Button>
                {open && (
                  <Disclosure.Panel static className={disclosurePanelCSS}>
                    <span>
                      Bisa untuk cabang lomba yang berbeda. Apabila ingin
                      mendaftarkan lebih dari satu tim untuk satu cabang lomba,
                      maka digunakan pula akun yang berbeda.
                    </span>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
          {(props.name !== "workshop" || props.name !== "webinar") && (
            <Disclosure as="div" className={disclosureContainerCSS}>
              {({ open }) => (
                <>
                  <Disclosure.Button className={disclosureButtonCSS}>
                    <span>
                      Apakah unggah Twibbon Technocorner 2022 wajib untuk setiap
                      peserta lomba?
                    </span>
                    <ChevronDownIcon
                      className={`${
                        open ? openPanelChevronIconCSS : ""
                      } ${ChevronIconCSS}`}
                    />
                  </Disclosure.Button>
                  {open && (
                    <Disclosure.Panel static className={disclosurePanelCSS}>
                      <span>
                        Ya, peserta lomba (IoT, EEC, Line Follower, dan
                        Transporter) wajib untuk mengunggah foto menggunakan
                        twibbon serta caption yang telah ditentukan melalui
                        instagram peserta. Twibbon dan caption dapat diakses
                        <span>
                          <a
                            className="text-cstmred"
                            href="https://link.technocorner.id/Twibbon"
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {" "}
                            di sini
                          </a>
                          .
                        </span>
                      </span>
                    </Disclosure.Panel>
                  )}
                </>
              )}
            </Disclosure>
          )}
          <Disclosure as="div" className={disclosureContainerCSS}>
            {({ open }) => (
              <>
                <Disclosure.Button className={disclosureButtonCSS}>
                  <span>
                    Apa yang harus dilakukan apabila telah mendaftar dan
                    mengunggah bukti pembayaran?
                  </span>
                  <ChevronDownIcon
                    className={`${
                      open ? openPanelChevronIconCSS : ""
                    } ${ChevronIconCSS}`}
                  />
                </Disclosure.Button>
                {open && (
                  <Disclosure.Panel static className={disclosurePanelCSS}>
                    <span>
                      Silakan menunggu email verifikasi hingga status pembayaran
                      pada dashboard berubah.
                    </span>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
          <Disclosure as="div" className={disclosureContainerCSS}>
            {({ open }) => (
              <>
                <Disclosure.Button className={disclosureButtonCSS}>
                  <span>Berapa lama pembayaran akan terkonfirmasi?</span>
                  <ChevronDownIcon
                    className={`${
                      open ? openPanelChevronIconCSS : ""
                    } ${ChevronIconCSS}`}
                  />
                </Disclosure.Button>
                {open && (
                  <Disclosure.Panel static className={disclosurePanelCSS}>
                    <span>
                      Pembayaran akan terkonfirmasi (status pada dashboard
                      berubah menjadi [terverifikasi]) paling lama 3x24 jam
                      setelah bukti pembayaran diunggah.
                    </span>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
          <Disclosure as="div" className={disclosureContainerCSS}>
            {({ open }) => (
              <>
                <Disclosure.Button className={disclosureButtonCSS}>
                  <span>Apa itu ID tim?</span>
                  <ChevronDownIcon
                    className={`${
                      open ? openPanelChevronIconCSS : ""
                    } ${ChevronIconCSS}`}
                  />
                </Disclosure.Button>
                {open && (
                  <Disclosure.Panel static className={disclosurePanelCSS}>
                    <span>
                      ID Tim adalah kode unik yang akan didapatkan ketika
                      mendaftar sebagai ketua tim di salah satu cabang lomba. ID
                      Tim akan digunakan oleh peserta yang mendaftar sebagai
                      anggota tim tersebut. Tiap tim yang mendaftar akan
                      mendapatkan ID Tim yang berbeda.
                    </span>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
          <Disclosure as="div" className={disclosureContainerCSS}>
            {({ open }) => (
              <>
                <Disclosure.Button className={disclosureButtonCSS}>
                  <span>
                    Apakah ada tawaran menarik/potongan harga pada pendaftaran
                    Technocorner 2022?
                  </span>
                  <ChevronDownIcon
                    className={`${
                      open ? openPanelChevronIconCSS : ""
                    } ${ChevronIconCSS}`}
                  />
                </Disclosure.Button>
                {open && (
                  <Disclosure.Panel static className={disclosurePanelCSS}>
                    <span>
                      Ada, khusus pendaftar cabang lomba robotik (Line Follower
                      atau Transporter). Untuk instansi yang mendaftarkan lebih
                      dari 10 tim ({">"}10) dan mendaftar di satu cabang lomba
                      yang sama (Line Follower atau Transporter) diberikan
                      potongan harga sebesar Rp5.000,00 per tim. Untuk
                      mendapatkan potongan harga tersebut, silakan hubungi CP.
                    </span>
                  </Disclosure.Panel>
                )}
              </>
            )}
          </Disclosure>
        </div>
        {/* F A Q KEGIATAN  */}
        <div>
          {list.map((items) => (
            <div key={items.id}>
              <Disclosure as="div" className={disclosureContainerCSS}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className={disclosureButtonCSS}>
                      <span>Kapan waktu akhir pendaftaran dan pembayaran?</span>
                      <ChevronDownIcon
                        className={`${
                          open ? openPanelChevronIconCSS : ""
                        } ${ChevronIconCSS}`}
                      />
                    </Disclosure.Button>
                    {open && (
                      <Disclosure.Panel static className={disclosurePanelCSS}>
                        <span>
                          Pendaftaran akan ditutup pada pukul 23.59 WIB di tiap
                          akhir masa pendaftaran. Untuk pembayaran akan dibatasi
                          hingga H+2 dari penutupan pendaftaran.
                        </span>
                      </Disclosure.Panel>
                    )}
                  </>
                )}
              </Disclosure>
              <Disclosure as="div" className={disclosureContainerCSS}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className={disclosureButtonCSS}>
                      <span>
                        Apabila mendaftarkan lebih dari satu tim, apakah
                        pembayaran harus dilakukan terpisah untuk setiap timnya?
                      </span>
                      <ChevronDownIcon
                        className={`${
                          open ? openPanelChevronIconCSS : ""
                        } ${ChevronIconCSS}`}
                      />
                    </Disclosure.Button>
                    {open && (
                      <Disclosure.Panel static className={disclosurePanelCSS}>
                        <span>
                          Untuk pembayaran dapat digabungkan menjadi satu
                          transaksi apabila sudah mengkonfirmasi daftar tim
                          beserta cabang lomba yang diikuti kepada CP dari tiap
                          cabang lomba.
                        </span>
                      </Disclosure.Panel>
                    )}
                  </>
                )}
              </Disclosure>
              <Disclosure as="div" className={disclosureContainerCSS}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className={disclosureButtonCSS}>
                      <span>
                        Apa yang harus dilakukan apabila telah mendaftar dan
                        mengunggah bukti pembayaran?
                      </span>
                      <ChevronDownIcon
                        className={`${
                          open ? openPanelChevronIconCSS : ""
                        } ${ChevronIconCSS}`}
                      />
                    </Disclosure.Button>
                    {open && (
                      <Disclosure.Panel static className={disclosurePanelCSS}>
                        <span>
                          Silakan menunggu email verifikasi hingga status
                          pembayaran pada dashboard berubah.
                        </span>
                      </Disclosure.Panel>
                    )}
                  </>
                )}
              </Disclosure>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
