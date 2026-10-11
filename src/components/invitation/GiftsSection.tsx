import React, { useState } from 'react';
import { Gift, Copy, Check, CreditCard, MapPin } from 'lucide-react';
import { RoyalDivider } from '../common/GununganIcon';
import { WeddingGift } from '../../types/wedding';

interface GiftsSectionProps {
  gifts: WeddingGift[];
  onNotify: (msg: string) => void;
}

export const GiftsSection: React.FC<GiftsSectionProps> = ({ gifts, onNotify }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const publishedGifts = gifts.filter((g) => g.isPublished);

  if (publishedGifts.length === 0) return null;

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id);
        onNotify(`${label} berhasil disalin ke papan klip.`);
        setTimeout(() => setCopiedId(null), 2500);
      })
      .catch(() => {
        onNotify('Gagal menyalin otomatis. Silakan salin manual.');
      });
  };

  return (
    <section id="gifts" className="py-12 px-6 bg-batik-subtle text-[#173D32]">
      <div className="max-w-md mx-auto text-center mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-[#997838] font-bold">
          Tanda Kasih
        </p>
        <h2 className="font-royal text-2xl font-bold tracking-wider text-[#173D32] mt-1">
          Hadiah Pernikahan
        </h2>
        <RoyalDivider className="my-4" />
        <p className="text-xs text-[#2c3e35]/80 font-serif-jawa italic max-w-xs mx-auto leading-relaxed">
          Doa restu panjenengan sami punika sampun dados kanugrahan ingkang tanpa upami kagem kula sakulawarga. Ananging menawi kepareng paring tanda tresna, saged lumantar:
        </p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {publishedGifts.map((gift) => {
          const isPhysicalGift = Boolean(gift.deliveryAddress);

          return (
            <div
              key={gift.id}
              className="p-5 rounded-2xl bg-white/85 border border-[#C5A15B]/40 shadow-lg backdrop-blur-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-royal text-xs font-bold text-[#173D32] uppercase tracking-wider flex items-center gap-1.5">
                  {isPhysicalGift ? (
                    <MapPin className="w-3.5 h-3.5 text-[#C5A15B]" />
                  ) : (
                    <CreditCard className="w-3.5 h-3.5 text-[#C5A15B]" />
                  )}
                  {gift.bankName}
                </span>
                {gift.description && (
                  <span className="text-[10px] text-[#997838] font-medium bg-[#C5A15B]/15 px-2 py-0.5 rounded-full">
                    {gift.description}
                  </span>
                )}
              </div>

              {isPhysicalGift ? (
                <div className="my-2">
                  <p className="text-xs text-[#173D32] font-semibold">{gift.accountHolder}</p>
                  <p className="text-xs text-[#4b5563] mt-1 font-serif-jawa leading-relaxed">
                    {gift.deliveryAddress}
                  </p>
                  <button
                    onClick={() =>
                      handleCopy(
                        gift.deliveryAddress || gift.accountNumber,
                        gift.id,
                        'Alamat Pengiriman'
                      )
                    }
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#235244] transition-all active:scale-95 shadow-sm"
                  >
                    {copiedId === gift.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#E0C782]" />
                        <span>Alamat Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Alamat Kirim</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="my-2">
                  <p className="font-mono text-base font-bold text-[#173D32] tracking-wider">
                    {gift.accountNumber}
                  </p>
                  <p className="text-xs text-[#6b7280] mt-0.5">a.n. {gift.accountHolder}</p>

                  <button
                    onClick={() => handleCopy(gift.accountNumber, gift.id, `No. Rekening ${gift.bankName}`)}
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-[#173D32] text-[#E0C782] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#235244] transition-all active:scale-95 shadow-sm"
                  >
                    {copiedId === gift.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#E0C782]" />
                        <span>Nomor Rekening Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin No. Rekening</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
