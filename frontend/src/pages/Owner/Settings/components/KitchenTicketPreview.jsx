import { ChefHat, Coffee, List } from 'lucide-react'
import { SAMPLE_ORDER_DATA } from '../data/printerTemplatesMockData'

export default function KitchenTicketPreview({
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
      className={`thermal-receipt-paper thermal-kitchen-ticket printable-receipt-container ${fontSizeClass} ${className}`}
      style={widthStyle}
    >
      {/* Jagged tear top edge */}
      <div className="thermal-receipt-tear thermal-receipt-tear--top" aria-hidden="true" />

      <div className="thermal-receipt-body">
        {/* Header Block */}
        <div className="kitchen-ticket-header">
          {content.cafeLogo && (
            <div className="receipt-logo-wrap" aria-hidden="true">
              <div className="receipt-logo-icon">
                <Coffee size={28} strokeWidth={2.2} />
              </div>
            </div>
          )}

          {content.cafeName && (
            <div className="kitchen-ticket-brand">{orderData.cafeName}</div>
          )}

          <div className="kitchen-ticket-title">
            {options.headerTitle || 'KITCHEN ORDER'}
          </div>
        </div>

        {content.dividerLine && <div className="receipt-divider receipt-divider--dashed" />}

        {/* Order Meta */}
        {(content.orderNumber ||
          content.dateTime ||
          content.tableNumber ||
          content.customerName ||
          content.preparedBy ||
          content.orderType) && (
          <div className="kitchen-ticket-meta">
            {content.orderNumber && (
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Order No:</span>
                <span className="receipt-meta-val receipt-bold font-mono">
                  {orderData.orderNumber}
                </span>
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
                <span className="receipt-meta-val receipt-bold receipt-highlight-table">
                  {orderData.tableNumber}
                </span>
              </div>
            )}

            {content.customerName && (
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Customer:</span>
                <span className="receipt-meta-val">{orderData.customerName}</span>
              </div>
            )}

            {content.preparedBy && (
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Prepared By:</span>
                <span className="receipt-meta-val">{orderData.preparedBy}</span>
              </div>
            )}

            {content.orderType && (
              <div className="receipt-meta-row">
                <span className="receipt-meta-label">Order Type:</span>
                <span className="receipt-meta-val receipt-bold">{orderData.orderType}</span>
              </div>
            )}
          </div>
        )}

        {content.dividerLine && <div className="receipt-divider receipt-divider--dashed" />}

        {/* Items List */}
        <div className="kitchen-ticket-items">
          {orderData.items.map((item, index) => (
            <div key={item.id} className="kitchen-ticket-item-entry">
              {index > 0 && content.dividerLine && (
                <div className="receipt-divider receipt-divider--dashed" />
              )}

              <div className="kitchen-ticket-item-head">
                <span className="kitchen-ticket-item-num-name">
                  <span className="kitchen-item-index">{index + 1}.</span>{' '}
                  <span className="receipt-bold">
                    {content.itemName ? item.name : '••••••••'}
                  </span>
                </span>
                {content.quantity && (
                  <span className="kitchen-ticket-qty-badge">
                    x {item.quantity}
                  </span>
                )}
              </div>

              {/* Variants & Choices */}
              {content.variantsChoices && item.variants && item.variants.length > 0 && (
                <div className="kitchen-ticket-variants">
                  {item.variants.map((v, idx) => (
                    <div key={idx} className="kitchen-variant-line">
                      - {v}
                    </div>
                  ))}
                </div>
              )}

              {/* Add-ons */}
              {content.addOns && item.addOns && item.addOns.length > 0 && (
                <div className="kitchen-ticket-addons">
                  {item.addOns.map((a, idx) => (
                    <div key={idx} className="kitchen-addon-line">
                      - {a}
                    </div>
                  ))}
                </div>
              )}

              {/* Special Instructions (warm peach box) */}
              {content.specialInstructions && item.specialInstructions && (
                <div className="kitchen-ticket-instruction-box">
                  <List size={13} className="kitchen-instruction-icon" />
                  <span>{item.specialInstructions}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {content.dividerLine && <div className="receipt-divider receipt-divider--dashed" />}

        {/* Footer Message */}
        {options.footerMessage && (
          <div className="kitchen-ticket-footer">
            <div className="kitchen-footer-text">{options.footerMessage}</div>
          </div>
        )}
      </div>

      {/* Jagged tear bottom edge */}
      <div className="thermal-receipt-tear thermal-receipt-tear--bottom" aria-hidden="true" />
    </div>
  )
}
