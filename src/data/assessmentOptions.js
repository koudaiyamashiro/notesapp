export const AGE_OPTIONS = Array.from({ length: 65 - 18 + 1 }, (_, index) => 18 + index)

export const EXPERIENCE_OPTIONS = Array.from({ length: 40 }, (_, index) => ({
  value: String(index + 1),
  label: `${index + 1}年`,
}))

export const INCOME_OPTIONS = [
  { value: '200未満', label: '200万円未満' },
  { value: '200-300', label: '200〜300万円' },
  { value: '300-400', label: '300〜400万円' },
  { value: '400-500', label: '400〜500万円' },
  { value: '500-600', label: '500〜600万円' },
  { value: '600-700', label: '600〜700万円' },
  { value: '700-800', label: '700〜800万円' },
  { value: '800-900', label: '800〜900万円' },
  { value: '900-1000', label: '900〜1000万円' },
  { value: '1000-1200', label: '1000〜1200万円' },
  { value: '1200以上', label: '1200万円以上' },
]

export const LEVEL_OPTIONS = ['メンバー', '主任', '係長', '課長', '部長', '執行役員', '経営層']

export const PURPOSE_OPTIONS = [
  '年収アップ',
  '市場価値向上',
  '裁量拡大',
  'マネジメント経験',
  'リモート勤務',
  'ワークライフバランス',
  '専門性向上',
  '事業責任者',
  '起業準備',
  'グローバル経験',
  '安定した環境',
  '新規事業経験',
]

export const WORK_STYLE_OPTIONS = ['出社中心', 'ハイブリッド', 'フルリモート', '裁量重視', '安定重視']

export const ROLE_OPTIONS = [
  { id: 'corporate_sales', label: '法人営業', category: '営業', popular: true, relatedSkills: ['新規開拓', '既存深耕', '顧客折衝', '課題ヒアリング'], relatedIndustries: ['SaaS', 'IT', '人材', '広告'] },
  { id: 'personal_sales', label: '個人営業', category: '営業', relatedSkills: ['提案資料作成', '顧客折衝', 'クロージング', '数値管理'], relatedIndustries: ['不動産', '保険', '金融', '小売'] },
  { id: 'inside_sales', label: 'インサイドセールス', category: '営業', popular: true, relatedSkills: ['新規開拓', 'CRM活用', '数値管理', '営業戦略'], relatedIndustries: ['SaaS', 'IT', '人材'] },
  { id: 'field_sales', label: 'フィールドセールス', category: '営業', relatedSkills: ['顧客折衝', '提案資料作成', 'クロージング', 'チームマネジメント'], relatedIndustries: ['SaaS', 'IT', '広告'] },
  { id: 'customer_success', label: 'カスタマーサクセス', category: '営業', popular: true, relatedSkills: ['既存深耕', '顧客折衝', 'CRM活用', '数値管理'], relatedIndustries: ['SaaS', 'IT', 'ヘルスケア'] },
  { id: 'channel_sales', label: '代理店営業', category: '営業', relatedSkills: ['既存深耕', '営業戦略', '顧客折衝', '提案資料作成'], relatedIndustries: ['IT', '通信', 'SaaS'] },
  { id: 'sales_planning', label: '営業企画', category: '営業', relatedSkills: ['営業戦略', '数値管理', 'CRM活用', 'チームマネジメント'], relatedIndustries: ['SaaS', 'IT', '人材'] },

  { id: 'digital_marketing', label: 'デジタルマーケティング', category: 'マーケティング', popular: true, relatedSkills: ['広告運用', 'データ分析', 'グロース施策', 'LP改善'], relatedIndustries: ['広告', 'SaaS', 'EC', 'メディア'] },
  { id: 'ad_operation', label: '広告運用', category: 'マーケティング', relatedSkills: ['広告運用', 'データ分析', 'LP改善', '数値管理'], relatedIndustries: ['広告', 'EC', 'ゲーム'] },
  { id: 'seo', label: 'SEO', category: 'マーケティング', relatedSkills: ['SEO', 'コンテンツ企画', 'データ分析', 'LP改善'], relatedIndustries: ['メディア', 'SaaS', 'EC'] },
  { id: 'crm', label: 'CRM', category: 'マーケティング', relatedSkills: ['CRM', 'MA', 'データ分析', 'グロース施策'], relatedIndustries: ['SaaS', 'EC', '金融'] },
  { id: 'ma_operations', label: 'MA運用', category: 'マーケティング', relatedSkills: ['MA', 'CRM', 'コンテンツ企画', 'データ分析'], relatedIndustries: ['SaaS', '人材', '教育'] },
  { id: 'brand_marketing', label: 'ブランドマーケティング', category: 'マーケティング', relatedSkills: ['ブランド戦略', 'コンテンツ企画', '顧客理解', 'プロジェクト推進'], relatedIndustries: ['広告', '食品', '小売'] },
  { id: 'content_marketing', label: 'コンテンツマーケティング', category: 'マーケティング', relatedSkills: ['コンテンツ企画', 'SEO', 'SNS運用', 'データ分析'], relatedIndustries: ['メディア', 'SaaS', 'EdTech'] },
  { id: 'growth_marketing', label: 'グロースマーケティング', category: 'マーケティング', popular: true, relatedSkills: ['グロース施策', 'LP改善', 'データ分析', '広告運用'], relatedIndustries: ['SaaS', 'EC', 'ゲーム'] },

  { id: 'web_engineer', label: 'Webエンジニア', category: 'IT/エンジニア', popular: true, relatedSkills: ['要件定義', 'バックエンド開発', 'フロントエンド開発', 'テスト設計'], relatedIndustries: ['IT', 'SaaS', 'スタートアップ'] },
  { id: 'frontend_engineer', label: 'フロントエンドエンジニア', category: 'IT/エンジニア', relatedSkills: ['フロントエンド開発', 'UI実装', 'テスト設計', '技術選定'], relatedIndustries: ['IT', 'SaaS', 'メディア'] },
  { id: 'backend_engineer', label: 'バックエンドエンジニア', category: 'IT/エンジニア', popular: true, relatedSkills: ['バックエンド開発', 'API設計', 'DB設計', '要件定義'], relatedIndustries: ['IT', 'SaaS', 'FinTech'] },
  { id: 'infra_engineer', label: 'インフラエンジニア', category: 'IT/エンジニア', relatedSkills: ['インフラ設計', '運用保守', 'セキュリティ', 'クラウド設計'], relatedIndustries: ['IT', '通信', '金融'] },
  { id: 'cloud_engineer', label: 'クラウドエンジニア', category: 'IT/エンジニア', popular: true, relatedSkills: ['クラウド設計', 'インフラ設計', 'セキュリティ', '技術選定'], relatedIndustries: ['IT', 'SaaS', 'DX'] },
  { id: 'data_engineer', label: 'データエンジニア', category: 'IT/エンジニア', relatedSkills: ['DB設計', 'データ基盤構築', 'API設計', 'クラウド設計'], relatedIndustries: ['AI', 'FinTech', 'SaaS'] },
  { id: 'aiml_engineer', label: 'AI/MLエンジニア', category: 'IT/エンジニア', popular: true, relatedSkills: ['AI/ML実装', 'データ分析', '技術選定', '運用保守'], relatedIndustries: ['AI', 'ヘルスケア', 'SaaS'] },
  { id: 'security_engineer', label: 'セキュリティエンジニア', category: 'IT/エンジニア', relatedSkills: ['セキュリティ', 'クラウド設計', 'インフラ設計', '運用保守'], relatedIndustries: ['IT', '金融', '通信'] },
  { id: 'corp_it', label: '情シス', category: 'IT/エンジニア', relatedSkills: ['運用保守', '要件定義', 'セキュリティ', 'プロジェクト推進'], relatedIndustries: ['IT', '製造', '小売'] },

  { id: 'strategy_consultant', label: '戦略コンサル', category: 'コンサル', popular: true, relatedSkills: ['課題整理', '仮説構築', 'データ分析', '資料作成'], relatedIndustries: ['戦略コンサル', '総合コンサル', '金融'] },
  { id: 'it_consultant', label: 'ITコンサル', category: 'コンサル', popular: true, relatedSkills: ['課題整理', '業務設計', 'プロジェクト推進', 'PMO'], relatedIndustries: ['IT', 'DX', 'ITコンサル', 'SaaS'] },
  { id: 'operations_consultant', label: '業務コンサル', category: 'コンサル', relatedSkills: ['業務設計', '課題整理', 'ファシリテーション', 'クライアント折衝'], relatedIndustries: ['総合コンサル', '製造', '金融'] },
  { id: 'hr_consultant', label: '人事コンサル', category: 'コンサル', relatedSkills: ['採用戦略', '組織設計', '課題整理', 'クライアント折衝'], relatedIndustries: ['人材', '総合コンサル', 'SaaS'] },
  { id: 'finance_consultant', label: '財務会計コンサル', category: 'コンサル', relatedSkills: ['財務分析', '経理決算', '資料作成', '課題整理'], relatedIndustries: ['金融', '総合コンサル', 'FinTech'] },
  { id: 'dx_consultant', label: 'DXコンサル', category: 'コンサル', popular: true, relatedSkills: ['業務設計', 'プロジェクト推進', 'データ分析', 'ステークホルダー調整'], relatedIndustries: ['DX', 'IT', '製造'] },
  { id: 'pmo', label: 'PMO', category: 'コンサル', popular: true, relatedSkills: ['PMO', 'プロジェクト推進', '資料作成', 'ファシリテーション'], relatedIndustries: ['IT', 'DX', '総合コンサル'] },

  { id: 'business_planning', label: '事業企画', category: '企画', popular: true, relatedSkills: ['事業企画', 'データ分析', 'プロジェクト推進', '課題整理'], relatedIndustries: ['SaaS', 'メガベンチャー', '人材'] },
  { id: 'corporate_planning', label: '経営企画', category: '企画', relatedSkills: ['経営企画', '財務分析', '資料作成', '経営管理'], relatedIndustries: ['金融', '製造', 'メガベンチャー'] },
  { id: 'biz_sales_planning', label: '営業企画', category: '企画', relatedSkills: ['営業戦略', '数値管理', 'CRM活用', '資料作成'], relatedIndustries: ['SaaS', 'IT', '人材'] },
  { id: 'product_planning', label: '商品企画', category: '企画', relatedSkills: ['商品企画', '市場調査', 'プロジェクト推進', '顧客理解'], relatedIndustries: ['食品', '小売', 'ヘルスケア'] },
  { id: 'service_planning', label: 'サービス企画', category: '企画', relatedSkills: ['サービス企画', 'データ分析', '業務設計', '顧客理解'], relatedIndustries: ['SaaS', '通信', 'メディア'] },
  { id: 'new_business_dev', label: '新規事業開発', category: '企画', popular: true, relatedSkills: ['新規事業開発', '市場調査', '仮説構築', 'プロジェクト推進'], relatedIndustries: ['スタートアップ', 'SaaS', 'メガベンチャー'] },

  { id: 'hr', label: '人事', category: '管理部門', relatedSkills: ['社内制度設計', '採用戦略', '労務管理', 'データ分析'], relatedIndustries: ['人材', 'SaaS', '製造'] },
  { id: 'recruiter', label: '採用', category: '管理部門', popular: true, relatedSkills: ['採用戦略', '候補者対応', '面接設計', '採用広報'], relatedIndustries: ['人材', 'SaaS', 'スタートアップ'] },
  { id: 'labor', label: '労務', category: '管理部門', relatedSkills: ['労務管理', '制度運用', '関係者調整', '業務改善'], relatedIndustries: ['製造', '小売', 'ヘルスケア'] },
  { id: 'accounting', label: '経理', category: '管理部門', popular: true, relatedSkills: ['経理決算', '財務分析', '数値管理', '業務改善'], relatedIndustries: ['金融', '製造', 'SaaS'] },
  { id: 'finance', label: '財務', category: '管理部門', relatedSkills: ['財務分析', '資金管理', '経営管理', 'IR対応'], relatedIndustries: ['金融', '製造', 'メガベンチャー'] },
  { id: 'legal', label: '法務', category: '管理部門', relatedSkills: ['契約法務', 'リスク管理', '社内制度設計', '関係者調整'], relatedIndustries: ['IT', '金融', '不動産'] },
  { id: 'general_affairs', label: '総務', category: '管理部門', relatedSkills: ['社内制度設計', '関係者調整', '業務改善', '運用管理'], relatedIndustries: ['製造', '小売', 'IT'] },
  { id: 'pr', label: '広報', category: '管理部門', relatedSkills: ['広報戦略', 'コンテンツ企画', 'メディア対応', 'ブランド戦略'], relatedIndustries: ['SaaS', 'スタートアップ', 'メディア'] },
  { id: 'ir', label: 'IR', category: '管理部門', relatedSkills: ['IR対応', '財務分析', '資料作成', '経営管理'], relatedIndustries: ['金融', '製造', '外資系'] },

  { id: 'uiux_designer', label: 'UI/UXデザイナー', category: 'デザイン/クリエイティブ', popular: true, relatedSkills: ['UI設計', 'UXリサーチ', 'プロトタイピング', 'デザインシステム'], relatedIndustries: ['SaaS', 'IT', 'メディア'] },
  { id: 'web_designer', label: 'Webデザイナー', category: 'デザイン/クリエイティブ', relatedSkills: ['Webデザイン', 'バナー制作', 'LP改善', 'コンテンツ制作'], relatedIndustries: ['広告', 'EC', 'メディア'] },
  { id: 'graphic_designer', label: 'グラフィックデザイナー', category: 'デザイン/クリエイティブ', relatedSkills: ['グラフィック制作', 'ブランド戦略', 'クリエイティブ企画', '進行管理'], relatedIndustries: ['広告', '食品', 'エンタメ'] },
  { id: 'video_editor', label: '動画編集', category: 'デザイン/クリエイティブ', relatedSkills: ['動画編集', 'コンテンツ制作', '進行管理', 'SNS運用'], relatedIndustries: ['メディア', '広告', 'エンタメ'] },
  { id: 'copywriter', label: 'コピーライター', category: 'デザイン/クリエイティブ', relatedSkills: ['コピーライティング', 'ブランド戦略', 'コンテンツ企画', '顧客理解'], relatedIndustries: ['広告', 'メディア', 'EC'] },
  { id: 'content_creator', label: 'コンテンツ制作', category: 'デザイン/クリエイティブ', relatedSkills: ['コンテンツ企画', 'SEO', 'SNS運用', 'コピーライティング'], relatedIndustries: ['メディア', 'EdTech', 'SaaS'] },

  { id: 'banking', label: '銀行', category: '金融/専門職', relatedSkills: ['財務分析', '顧客折衝', 'リスク管理', '数値管理'], relatedIndustries: ['金融', '銀行', '不動産'] },
  { id: 'securities', label: '証券', category: '金融/専門職', relatedSkills: ['市場分析', '顧客折衝', '数値管理', '提案資料作成'], relatedIndustries: ['証券', '金融', '外資系'] },
  { id: 'insurance', label: '保険', category: '金融/専門職', relatedSkills: ['顧客折衝', '提案資料作成', '数値管理', 'リスク管理'], relatedIndustries: ['保険', '金融'] },
  { id: 'ma', label: 'M&A', category: '金融/専門職', popular: true, relatedSkills: ['財務分析', '資料作成', '交渉', 'プロジェクト推進'], relatedIndustries: ['M&A', '金融', 'コンサル'] },
  { id: 'real_estate', label: '不動産', category: '金融/専門職', relatedSkills: ['顧客折衝', '提案資料作成', '数値管理', '契約実務'], relatedIndustries: ['不動産', '建設', '金融'] },
  { id: 'professional', label: '士業', category: '金融/専門職', relatedSkills: ['契約法務', '財務分析', '資料作成', '顧客折衝'], relatedIndustries: ['金融', '士業', '不動産'] },

  { id: 'medical_sales', label: '医療営業', category: '医療/ヘルスケア', relatedSkills: ['顧客折衝', '提案資料作成', '課題ヒアリング', '数値管理'], relatedIndustries: ['医療', 'ヘルスケア', '製薬'] },
  { id: 'medical_admin', label: '医療事務', category: '医療/ヘルスケア', relatedSkills: ['運用管理', '関係者調整', '業務改善', '数値管理'], relatedIndustries: ['医療', 'ヘルスケア'] },
  { id: 'nurse', label: '看護', category: '医療/ヘルスケア', relatedSkills: ['顧客対応', 'チーム連携', '危機対応', '運用管理'], relatedIndustries: ['医療', 'ヘルスケア'] },
  { id: 'pharmacist', label: '薬剤師', category: '医療/ヘルスケア', relatedSkills: ['専門知識運用', '顧客対応', '品質管理', '運用改善'], relatedIndustries: ['医療', '製薬', 'ヘルスケア'] },
  { id: 'care_worker', label: '介護', category: '医療/ヘルスケア', relatedSkills: ['顧客対応', 'チーム連携', '運用管理', '関係者調整'], relatedIndustries: ['介護', 'ヘルスケア'] },
  { id: 'healthcare_business', label: 'ヘルスケア事業', category: '医療/ヘルスケア', relatedSkills: ['事業企画', '業務改善', '顧客理解', 'プロジェクト推進'], relatedIndustries: ['ヘルスケア', '医療', 'SaaS'] },

  { id: 'instructor', label: '講師', category: '教育', relatedSkills: ['ファシリテーション', 'コンテンツ制作', '顧客理解', '進行管理'], relatedIndustries: ['教育', 'EdTech'] },
  { id: 'training_planning', label: '研修企画', category: '教育', relatedSkills: ['研修企画', 'ファシリテーション', '課題整理', 'コンテンツ企画'], relatedIndustries: ['教育', '人材', 'EdTech'] },
  { id: 'education_business', label: '教育事業', category: '教育', relatedSkills: ['事業企画', '顧客理解', 'プロジェクト推進', '数値管理'], relatedIndustries: ['教育', 'EdTech'] },
  { id: 'edtech', label: 'EdTech', category: '教育', popular: true, relatedSkills: ['プロダクト企画', 'コンテンツ企画', 'データ分析', '顧客理解'], relatedIndustries: ['EdTech', '教育', 'SaaS'] },

  { id: 'store_operations', label: '店舗運営', category: 'その他', relatedSkills: ['運用管理', '数値管理', '顧客対応', 'チームマネジメント'], relatedIndustries: ['小売', '食品', '旅行'] },
  { id: 'logistics', label: '物流', category: 'その他', relatedSkills: ['業務改善', '運用管理', '数値管理', '関係者調整'], relatedIndustries: ['物流', '小売', '製造'] },
  { id: 'manufacturing', label: '製造', category: 'その他', relatedSkills: ['品質管理', '工程改善', '運用管理', '安全管理'], relatedIndustries: ['製造', '自動車', '食品'] },
  { id: 'quality_control', label: '品質管理', category: 'その他', relatedSkills: ['品質管理', '原因分析', '運用改善', '資料作成'], relatedIndustries: ['製造', '医療', '食品'] },
  { id: 'rnd', label: '研究開発', category: 'その他', relatedSkills: ['研究開発', 'データ分析', '実験設計', '資料作成'], relatedIndustries: ['AI', '製薬', '製造'] },
  { id: 'civil_servant', label: '公務員', category: 'その他', relatedSkills: ['関係者調整', '資料作成', '運用管理', '制度設計'], relatedIndustries: ['官公庁', '地方創生', 'NPO'] },
  { id: 'freelance', label: 'フリーランス', category: 'その他', popular: true, relatedSkills: ['顧客折衝', 'プロジェクト推進', '提案資料作成', '専門性発揮'], relatedIndustries: ['IT', 'デザイン', 'コンサル'] },
]

export const INDUSTRY_OPTIONS = [
  { id: 'saas', label: 'SaaS', category: 'テクノロジー', popular: true },
  { id: 'ai', label: 'AI', category: 'テクノロジー', popular: true },
  { id: 'dx', label: 'DX', category: 'テクノロジー', popular: true },
  { id: 'it', label: 'IT', category: 'テクノロジー', popular: true },
  { id: 'it_consulting', label: 'ITコンサル', category: 'コンサル', popular: true },
  { id: 'strategy_consulting', label: '戦略コンサル', category: 'コンサル' },
  { id: 'general_consulting', label: '総合コンサル', category: 'コンサル' },
  { id: 'hr', label: '人材', category: 'サービス', popular: true },
  { id: 'advertising', label: '広告', category: 'サービス' },
  { id: 'marketing', label: 'マーケティング', category: 'サービス' },
  { id: 'finance', label: '金融', category: '金融', popular: true },
  { id: 'fintech', label: 'FinTech', category: '金融', popular: true },
  { id: 'insurance', label: '保険', category: '金融' },
  { id: 'securities', label: '証券', category: '金融' },
  { id: 'real_estate', label: '不動産', category: '事業・社会基盤' },
  { id: 'construction', label: '建設', category: '事業・社会基盤' },
  { id: 'manufacturing', label: '製造', category: '事業・社会基盤', popular: true },
  { id: 'automotive', label: '自動車', category: '事業・社会基盤' },
  { id: 'trading', label: '商社', category: '事業・社会基盤' },
  { id: 'retail', label: '小売', category: '消費財・流通' },
  { id: 'ec', label: 'EC', category: '消費財・流通', popular: true },
  { id: 'logistics', label: '物流', category: '消費財・流通' },
  { id: 'medical', label: '医療', category: 'ヘルスケア・ライフサイエンス', popular: true },
  { id: 'healthcare', label: 'ヘルスケア', category: 'ヘルスケア・ライフサイエンス', popular: true },
  { id: 'pharma', label: '製薬', category: 'ヘルスケア・ライフサイエンス' },
  { id: 'education', label: '教育', category: '教育・公共', popular: true },
  { id: 'edtech', label: 'EdTech', category: '教育・公共', popular: true },
  { id: 'entertainment', label: 'エンタメ', category: 'メディア・通信' },
  { id: 'gaming', label: 'ゲーム', category: 'メディア・通信' },
  { id: 'media', label: 'メディア', category: 'メディア・通信' },
  { id: 'telecom', label: '通信', category: 'メディア・通信' },
  { id: 'infrastructure', label: 'インフラ', category: '事業・社会基盤' },
  { id: 'energy', label: 'エネルギー', category: '事業・社会基盤' },
  { id: 'food', label: '食品', category: '消費財・流通' },
  { id: 'travel', label: '旅行', category: 'サービス' },
  { id: 'tourism', label: '観光', category: 'サービス' },
  { id: 'regional', label: '地方創生', category: '教育・公共' },
  { id: 'government', label: '官公庁', category: '教育・公共' },
  { id: 'npo', label: 'NPO', category: '教育・公共' },
  { id: 'startup', label: 'スタートアップ', category: '企業フェーズ', popular: true },
  { id: 'global', label: '外資系', category: '企業フェーズ' },
  { id: 'mega_venture', label: 'メガベンチャー', category: '企業フェーズ', popular: true },
]

const COMMON_STRENGTHS = [
  '課題整理',
  'プロジェクト推進',
  '資料作成',
  '関係者調整',
  'データ分析',
  '業務改善',
  'チームマネジメント',
  'ファシリテーション',
]

const CATEGORY_STRENGTHS = {
  営業: ['新規開拓', '既存深耕', '提案資料作成', '顧客折衝', '課題ヒアリング', 'クロージング', '数値管理', 'CRM活用', '営業戦略', 'チームマネジメント'],
  マーケティング: ['SEO', '広告運用', 'SNS運用', 'CRM', 'MA', 'コンテンツ企画', 'ブランド戦略', 'データ分析', 'LP改善', 'グロース施策'],
  'IT/エンジニア': ['要件定義', 'フロントエンド開発', 'バックエンド開発', 'インフラ設計', 'クラウド設計', 'API設計', 'DB設計', 'セキュリティ', 'テスト設計', '運用保守', '技術選定'],
  コンサル: ['課題整理', '仮説構築', 'リサーチ', 'データ分析', '業務設計', 'プロジェクト推進', 'ステークホルダー調整', '資料作成', 'ファシリテーション', 'PMO', 'クライアント折衝'],
  企画: ['事業企画', '経営企画', 'サービス企画', '市場調査', '数値管理', 'プロジェクト推進', '新規事業開発', '事業計画作成'],
  管理部門: ['採用戦略', '労務管理', '経理決算', '財務分析', '契約法務', '社内制度設計', '広報戦略', 'IR対応'],
  'デザイン/クリエイティブ': ['UI設計', 'UXリサーチ', 'Webデザイン', 'グラフィック制作', '動画編集', 'コピーライティング', 'コンテンツ制作', '進行管理'],
  '金融/専門職': ['財務分析', '市場分析', 'リスク管理', '契約実務', '提案資料作成', '顧客折衝'],
  '医療/ヘルスケア': ['顧客対応', '専門知識運用', 'チーム連携', '運用改善', '品質管理'],
  教育: ['研修企画', 'ファシリテーション', 'コンテンツ企画', '顧客理解', '運用設計'],
  その他: ['店舗運営', '物流改善', '品質管理', '研究開発', '制度運用'],
}

const COMMON_WEAKNESSES = [
  '曖昧な要件の整理',
  '長期的な調整業務',
  '高いプレッシャー環境',
  'マルチタスク',
  '未経験領域の自走学習',
  '数値責任の重い役割',
]

const CATEGORY_WEAKNESSES = {
  営業: ['新規開拓中心の営業活動', 'クロージングの駆け引き', '厳密なパイプライン管理', '短期数字の強いプレッシャー', '長時間の対面商談'],
  マーケティング: ['広告クリエイティブの高速改善', '細かい数値検証の反復', 'SNSの即時運用', 'ブランド表現の抽象議論'],
  'IT/エンジニア': ['障害対応の即時判断', 'レガシー環境の保守', '複雑な非機能要件の整理', '詳細なテストケース設計'],
  コンサル: ['短納期の資料作成', '高密度なファシリテーション', '抽象度の高い仮説構築', '役員クラスとの折衝'],
  企画: ['答えのない企画検討', '経営層向けの意思決定資料作成', '全社横断の調整', '長期目線でのKPI設計'],
  管理部門: ['制度運用の細かい例外対応', '厳密な法令・会計ルール対応', '突発的な監査・開示対応'],
  'デザイン/クリエイティブ': ['抽象的なフィードバック整理', '短納期の量産制作', '細かな表現調整の反復'],
  '金融/専門職': ['厳格な数値精度管理', '高難度な専門資格前提の業務', '高額案件の交渉'],
  '医療/ヘルスケア': ['夜勤・シフト前提の働き方', '緊急対応の多い環境', '細かな法規制対応'],
  教育: ['長時間の対面ファシリテーション', '個別最適の対応が多い環境', '保護者/法人との難易度高い調整'],
  その他: ['現場オペレーションの突発対応', '厳密な品質基準の維持', '物理的な負荷が高い働き方'],
}

export function getRoleOption(label) {
  return ROLE_OPTIONS.find((option) => option.label === label)
}

export function getGroupedRoleOptions() {
  return ROLE_OPTIONS.reduce((acc, option) => {
    if (!acc[option.category]) acc[option.category] = []
    acc[option.category].push(option)
    return acc
  }, {})
}

export function getStrengthOptionsForRole(roleLabel) {
  const role = getRoleOption(roleLabel)
  const categoryOptions = role ? CATEGORY_STRENGTHS[role.category] || [] : COMMON_STRENGTHS
  const roleOptions = role?.relatedSkills || []
  return Array.from(new Set([...roleOptions, ...categoryOptions, ...COMMON_STRENGTHS])).map((label) => ({
    id: label,
    label,
    category: role?.category || '共通',
    popular: roleOptions.includes(label),
  }))
}

export function getWeaknessOptionsForRole(roleLabel) {
  const role = getRoleOption(roleLabel)
  const categoryOptions = role ? CATEGORY_WEAKNESSES[role.category] || [] : COMMON_WEAKNESSES
  return Array.from(new Set([...categoryOptions, ...COMMON_WEAKNESSES])).map((label) => ({
    id: label,
    label,
    category: role?.category || '共通',
    popular: categoryOptions.slice(0, 4).includes(label),
  }))
}