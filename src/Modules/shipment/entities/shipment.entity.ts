@Column({ type: 'jsonb', nullable: false })
to_address: {
  street: string;
  city: string;
  neighborhood?: string;
};

@Column({ type: 'jsonb', nullable: false })
recipient_info: {
  name: string;
  phone: string;
  notes?: string;
};

@Column({ type: 'varchar' })
type_code: string; // يربط بجدول lookup مثل shipment_types

@Column({ type: 'decimal', default: 0 })
delivery_fee: number;

@Column({ type: 'varchar', default: 'cod' })
payment_method: 'cod' | 'prepaid';
