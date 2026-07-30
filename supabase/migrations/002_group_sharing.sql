-- 1. ÖNCE HATALI POLİTİKALARI TEMİZLEYELİM
DROP POLICY IF EXISTS "Üyeler kendi gruplarını görebilir" ON groups;
DROP POLICY IF EXISTS "Herkes grup oluşturabilir" ON groups;
DROP POLICY IF EXISTS "Kurucular grubu silebilir" ON groups;

DROP POLICY IF EXISTS "Grup içi üyeleri görme" ON group_members;
DROP POLICY IF EXISTS "Kullanıcılar gruba katılabilir" ON group_members;
DROP POLICY IF EXISTS "Üye çıkışı veya çıkarılması" ON group_members;

DROP POLICY IF EXISTS "Grup üyeleri paylaşımları görebilir" ON shared_content;
DROP POLICY IF EXISTS "Grup üyeleri içerik paylaşabilir" ON shared_content;
DROP POLICY IF EXISTS "Sadece paylaşan kişi içeriği silebilir" ON shared_content;

DROP POLICY IF EXISTS "Grup üyeleri paylaşılan quiz_sessions verisini görebilir" ON quiz_sessions;


-- 2. INFINITE RECURSION (Sonsuz Döngü) ÖNLEMEK İÇİN YARDIMCI FONKSİYONLAR
-- RLS politikalarının kendi kendini çağırmasını engellemek için Security Definer fonksiyonlar kullanmalıyız.

CREATE OR REPLACE FUNCTION public.is_group_member(grp_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = grp_id AND user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_group_creator(grp_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.groups 
    WHERE id = grp_id AND created_by = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;


-- 3. GÜVENLİK POLİTİKALARINI YENİDEN OLUŞTURMA (FONKSİYONLAR İLE)

-- GROUPS Tablosu
CREATE POLICY "Üyeler kendi gruplarını görebilir" ON groups FOR SELECT 
USING ( created_by = auth.uid() OR public.is_group_member(id) );

CREATE POLICY "Herkes grup oluşturabilir" ON groups FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Kurucular grubu silebilir" ON groups FOR DELETE 
USING (auth.uid() = created_by);


-- GROUP_MEMBERS Tablosu
CREATE POLICY "Grup içi üyeleri görme" ON group_members FOR SELECT 
USING ( user_id = auth.uid() OR public.is_group_member(group_id) );

CREATE POLICY "Kullanıcılar gruba katılabilir" ON group_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Üye çıkışı veya çıkarılması" ON group_members FOR DELETE 
USING ( user_id = auth.uid() OR public.is_group_creator(group_id) );


-- SHARED_CONTENT Tablosu
CREATE POLICY "Grup üyeleri paylaşımları görebilir" ON shared_content FOR SELECT 
USING ( public.is_group_member(group_id) );

CREATE POLICY "Grup üyeleri içerik paylaşabilir" ON shared_content FOR INSERT 
WITH CHECK ( auth.uid() = shared_by AND public.is_group_member(group_id) );

CREATE POLICY "Sadece paylaşan kişi içeriği silebilir" ON shared_content FOR DELETE 
USING ( auth.uid() = shared_by );


-- 4. QUIZ SESSIONS TABLOSUNA EK POLİTİKA
CREATE POLICY "Grup üyeleri paylaşılan quiz_sessions verisini görebilir" ON quiz_sessions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM shared_content sc
    WHERE sc.content_id = quiz_sessions.id
    AND public.is_group_member(sc.group_id)
  )
);
