update products p set measurements = v.m::jsonb from (values
('Levi''s 501 selvedge jeans','{"waist_cm":81,"inseam_cm":76,"rise_cm":28}'),
('Carhartt chore coat','{"chest_cm":62,"length_cm":76,"sleeve_cm":64}'),
('Harley-Davidson band tee','{"chest_cm":58,"length_cm":73}'),
('Schott leather bomber','{"chest_cm":56,"length_cm":64,"sleeve_cm":63}'),
('Pendleton wool flannel','{"chest_cm":56,"length_cm":75,"sleeve_cm":62}'),
('Varsity letterman jacket','{"chest_cm":63,"length_cm":70,"sleeve_cm":66}'),
('Wrangler denim jacket','{"chest_cm":60,"length_cm":68,"sleeve_cm":64}'),
('Nike windbreaker','{"chest_cm":62,"length_cm":71,"sleeve_cm":65}'),
('Dickies work trousers','{"waist_cm":86,"inseam_cm":79,"rise_cm":29}'),
('Fruit of the Loom sweatshirt','{"chest_cm":57,"length_cm":65,"sleeve_cm":60}'),
('Ralph Lauren rugby shirt','{"chest_cm":60,"length_cm":75,"sleeve_cm":64}'),
('Timberland leather belt','{"length_cm":105,"width_cm":3.5}')
) v(name,m) where p.name = v.name;
-- Add photos to a piece (paste your own image URLs):
-- update products set images = array['https://.../front.jpg','https://.../back.jpg'] where name = 'Levi''s 501 selvedge jeans';
