import { Coffee, QrCode } from 'lucide-react'
import { SAMPLE_ORDER_DATA } from '../data/printerTemplatesMockData'

export default function CustomerReceiptPreview({
  template,
  orderData = SAMPLE_ORDER_DATA,
  className = '',
  paperWidthOverride = null,
}) {
  const content = template?.content || {}
  const options = template?.options || {}

  const activePaperWidth = paperWidthOverride || options.paperWidth || '80 mm (Thermal)'
  const fontSizeClass =
    options.fontSize === 'Small'
      ? 'receipt-font--small'
      : options.fontSize === 'Large'
      ? 'receipt-font--large'
      : 'receipt-font--normal'

  const dividerClass =
    options.dividerStyle === 'solid'
      ? 'receipt-divider--solid'
      : options.dividerStyle === 'dotted'
      ? 'receipt-divider--dotted'
      : 'receipt-divider--dashed'

  const alignClass =
    options.alignment === 'left'
      ? 'receipt-align--left'
      : options.alignment === 'right'
      ? 'receipt-align--right'
      : 'receipt-align--center'

  const widthStyle = {
    width: '100%',
    maxWidth:
      activePaperWidth === '58 mm (Thermal)'
        ? '260px'
        : activePaperWidth === 'A4'
        ? '100%'
        : '335px',
  }

  return (
    <div
      className={`thermal-receipt-paper printable-receipt-container ${fontSizeClass} ${className}`}
      style={widthStyle}
    >
      {/* Jagged tear top edge */}
      <div className="thermal-receipt-tear thermal-receipt-tear--top" aria-hidden="true" />

      <div className="thermal-receipt-body">
        {/* Header Section */}
        <div className={`receipt-header-section ${alignClass}`}>
          {content.cafeLogo && (
            <div className="receipt-logo-wrap" aria-hidden="true">
              <div className="receipt-logo-icon">
                <Coffee size={28} strokeWidth={2.2} />
              </div>
            </div>
          )}

          {content.cafeName && (
            <div className="receipt-brand-title">
              {options.headerTitle || orderData.cafeName}
            </div>
          )}

          {content.tagline && options.tagline && (
            <div className="receipt-tagline">{options.tagline}</div>
          )}
        </div>

        {/* Divider after brand */}
        {(content.address || content.phoneNumber) && (
          <div className={`receipt-divider ${dividerClass}`} />
        )}

        {/* Address and Phone */}
        {(content.address || content.phoneNumber) && (
          <div className={`receipt-meta-contact ${alignClass}`}>
            {content.address && (
              <div className="receipt-address">{orderData.address}</div>
            )}
            {content.phoneNumber && (
              <div className="receipt-phone">{orderData.phoneNumber}</div>
            )}
          </div>
        )}

        {/* Divider before order info */}
        {(content.orderNumber ||
          content.dateTime ||
          content.tableNumber ||
          content.customerName) && (
          <div className={`receipt-divider ${dividerClass}`} />
        )}

        {/* Order Information */}
        {(content.orderNumber ||
          content.dateTime ||
          content.tableNumber ||
          content.customerName) && (
          <div className="receipt-order-meta">
            {content.orderNumber && (
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Order No:</span>
                <span className="receipt-meta-val receipt-bold">{orderData.orderNumber}</span>
              </div>
            )}
            {content.dateTime && (
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Date:</span>
                <span className="receipt-meta-val">{orderData.dateTime}</span>
              </div>
            )}
            {content.tableNumber && (
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Table:</span>
                <span className="receipt-meta-val receipt-bold">{orderData.tableNumber}</span>
              </div>
            )}
            {content.customerName && (
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Customer:</span>
                <span className="receipt-meta-val">{orderData.customerName}</span>
              </div>
            )}
          </div>
        )}

        {/* Divider before items */}
        <div className={`receipt-divider ${dividerClass}`} />

        {/* Order Items Table */}
        <div className="receipt-items-table">
          <div className="receipt-items-head">
            <span className="receipt-col-item">Item</span>
            {content.quantity && <span className="receipt-col-qty">Qty</span>}
            {content.price && <span className="receipt-col-price">Price</span>}
            <span className="receipt-col-total">Total</span>
          </div>

          <div className="receipt-items-list">
            {orderData.items.map((item) => (
              <div key={item.id} className="receipt-item-entry">
                <div className="receipt-item-main-row">
                  <span className="receipt-col-item receipt-item-name">
                    {content.itemName ? item.name : '••••••••'}
                  </span>
                  {content.quantity && (
                    <span className="receipt-col-qty">{item.quantity}</span>
                  )}
                  {content.price && (
                    <span className="receipt-col-price">₹{item.price}</span>
                  )}
                  <span className="receipt-col-total receipt-bold">
                    ₹{item.total}
                  </span>
                </div>

                {/* Variants & Choices */}
                {content.variantsChoices && item.variants && item.variants.length > 0 && (
                  <div className="receipt-item-variants">
                    {item.variants.map((v, idx) => (
                      <div key={idx} className="receipt-item-variant-line">
                        + {v}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add-ons */}
                {content.addOns && item.addOns && item.addOns.length > 0 && (
                  <div className="receipt-item-addons">
                    {item.addOns.map((a, idx) => (
                      <div key={idx} className="receipt-item-addon-line">
                        + {a}
                      </div>
                    ))}
                  </div>
                )}

                {/* Special Instructions (if enabled) */}
                {content.specialInstructions && item.specialInstructions && (
                  <div className="receipt-item-instructions">
                    * {item.specialInstructions}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divider before summary */}
        <div className={`receipt-divider ${dividerClass}`} />

        {/* Bill Summary */}
        <div className="receipt-summary-block">
          {content.subtotal && (
            <div className="receipt-summary-row">
              <span>Subtotal</span>
              <span>₹{orderData.subtotal}</span>
            </div>
          )}

          {content.discount && (
            <div className="receipt-summary-row">
              <span>Discount ({orderData.discountPercent}%)</span>
              <span>-₹{orderData.discount}</span>
            </div>
          )}

          {content.taxGst && (
            <div className="receipt-summary-row">
              <span>GST ({orderData.taxPercent}%)</span>
              <span>₹{orderData.taxGst}</span>
            </div>
          )}

          {content.total && (
            <>
              <div className={`receipt-divider ${dividerClass}`} />
              <div className="receipt-summary-row receipt-summary-total">
                <span>Total</span>
                <span>₹{orderData.total}</span>
              </div>
            </>
          )}

          {content.paymentMethod && (
            <div className="receipt-summary-row receipt-payment-row">
              <span>Payment Method:</span>
              <span className="receipt-bold">{orderData.paymentMethod}</span>
            </div>
          )}
        </div>

        {/* Optional QR Code */}
        {options.showQrCode && (
          <div className={`receipt-qr-section ${alignClass}`}>
            <div className={`receipt-divider ${dividerClass}`} />
            <div className="receipt-qr-box">
              <QrCode size={52} strokeWidth={1.8} />
              {options.qrCodeText && (
                <span className="receipt-qr-text">{options.qrCodeText}</span>
              )}
            </div>
          </div>
        )}

        {/* Footer Message */}
        {content.footerMessage && options.footerMessage && (
          <div className={`receipt-footer-section ${alignClass}`}>
            <div className={`receipt-divider ${dividerClass}`} />
            <div className="receipt-footer-text">
              {options.footerMessage.split('\n').map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Jagged tear bottom edge */}
      <div className="thermal-receipt-tear thermal-receipt-tear--bottom" aria-hidden="true" />
    </div>
  )
}
