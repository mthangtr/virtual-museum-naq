# 🎮 TÀI LIỆU THIẾT KẾ GAME
## BẢO TÀNG ẢO NGUYỄN ÁI QUỐC
*The Virtual Museum of Nguyễn Ái Quốc – The Journey to Found the Communist Party of Vietnam*

---

## 📋 MỤC LỤC
1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Thiết kế gameplay](#2-thiết-kế-gameplay)
3. [Cấu trúc không gian 3D](#3-cấu-trúc-không-gian-3d)
4. [Nội dung từng phòng triển lãm](#4-nội-dung-từng-phòng-triển-lãm)
5. [Hệ thống tương tác](#5-hệ-thống-tương-tác)
6. [Thiết kế giao diện](#6-thiết-kế-giao-diện)
7. [Âm thanh và hiệu ứng](#7-âm-thanh-và-hiệu-ứng)
8. [Công nghệ và triển khai](#8-công-nghệ-và-triển-khai)
9. [Phân công nhóm](#9-phân-công-nhóm)

---

## 1. TỔNG QUAN DỰ ÁN

### 🎯 Mục tiêu
Tạo ra một trải nghiệm bảo tàng ảo 3D tương tác, cho phép người dùng tự do khám phá hành trình chuẩn bị thành lập Đảng Cộng sản Việt Nam của Nguyễn Ái Quốc từ 1911 đến 1930.

### 🎮 Thể loại
- **Genre**: 3D Virtual Museum Explorer
- **Platform**: Web-based (chạy trên trình duyệt)
- **Điều khiển**: Bàn phím (WASD) + Chuột

### 💡 Thông điệp cốt lõi
> *"Mỗi bước chân của Nguyễn Ái Quốc là một bước chuẩn bị cho sự ra đời của Đảng Cộng sản Việt Nam"*

### ⏱️ Thời lượng trải nghiệm
**8-12 phút** (tùy tốc độ khám phá của người chơi)

---

## 2. THIẾT KẾ GAMEPLAY

### 🕹️ Cơ chế điều khiển

#### Di chuyển
- **W**: Đi về phía trước
- **A**: Sang trái
- **S**: Lùi lại
- **D**: Sang phải
- **Chuột**: Xoay camera 360° (góc nhìn người thứ nhất)
- **Scroll chuột**: Zoom in/out (giới hạn nhẹ để giữ trải nghiệm)

#### Tương tác
- **Click chuột trái**: Tương tác với vật thể
- **Hover chuột**: Hiện tooltip tên vật thể
- **Phím E**: Tương tác nhanh khi đứng gần vật thể

#### Di chuyển giữa các phòng
- **Tự động mở cửa**: Khi người chơi đã tương tác với đủ số vật thể yêu cầu trong phòng
- **Indicator**: Mũi tên sáng chỉ hướng khi cửa đã mở

### 🎯 Mục tiêu người chơi
1. Khám phá 4 phòng triển lãm theo trình tự thời gian
2. Tương tác với các vật thể lịch sử để mở khóa thông tin
3. Hiểu rõ quá trình chuẩn bị thành lập Đảng của Nguyễn Ái Quốc
4. Hoàn thành hành trình và đạt được màn hình kết thúc

### 📊 Tiến trình game
```
Home Screen 
    ↓
Phòng 1: Khởi hành (1911-1919)
    ↓ [3/3 vật thể đã khám phá]
Phòng 2: Ánh sáng Lênin (1920-1923)
    ↓ [3/3 vật thể đã khám phá]
Phòng 3: Quảng Châu (1924-1927)
    ↓ [3/3 vật thể đã khám phá]
Phòng 4: Hội nghị Hương Cảng (1930)
    ↓ [Sự kiện hợp nhất hoàn tất]
Phòng Kết: Kỷ nguyên mới
    ↓
End Screen / Quay lại Home
```

---

## 3. CẤU TRÚC KHÔNG GIAN 3D

### 🗺️ Bản đồ tổng thể

```
                    [HOME LOBBY]
                         |
              [Cổng vào phát sáng]
                         |
            ╔════════════════════════╗
            ║   PHÒNG 1: Khởi hành  ║
            ║      (Bến cảng)        ║
            ╚═══════════╦════════════╝
                        |
            ╔═══════════╩════════════╗
            ║ PHÒNG 2: Ánh sáng      ║
            ║      (Thư viện)        ║
            ╚═══════════╦════════════╝
                        |
            ╔═══════════╩════════════╗
            ║  PHÒNG 3: Quảng Châu   ║
            ║     (Lớp học)          ║
            ╚═══════════╦════════════╝
                        |
            ╔═══════════╩════════════╗
            ║ PHÒNG 4: Hương Cảng    ║
            ║    (Phòng họp)         ║
            ╚═══════════╦════════════╝
                        |
            ╔═══════════╩════════════╗
            ║ PHÒNG KẾT: Kỷ nguyên   ║
            ║        mới             ║
            ╚════════════════════════╝
```

### 📐 Kích thước không gian
- **Mỗi phòng**: 20m x 15m x 5m (chiều dài x rộng x cao)
- **Tốc độ di chuyển**: 3m/s
- **Tầm nhìn camera**: FOV 75°
- **Tầm tương tác**: 2m (khoảng cách với vật thể)

---

## 4. NỘI DUNG TỪNG PHÒNG TRIỂN LÃM

### 🏠 **HOME SCREEN - Sảnh chào mừng**

#### Mô tả không gian
- **Nền**: Tối, hiệu ứng ánh sáng đỏ-vàng nhảy múa nhẹ
- **Trung tâm**: Logo Đảng 3D (búa liềm) xoay chậm với ánh sáng phát ra
- **Phía sau**: Cổng vào bảo tàng phát sáng trắng vàng
- **Âm thanh**: "Tiến quân ca" phiên bản piano nhẹ nhàng (fade-in)

#### Tương tác
- **Nút "BẮT ĐẦU THAM QUAN"**: Hiện ở giữa màn hình
- **Hiệu ứng khi click**: Camera bay qua cổng sáng (animation 2 giây) → fade to white → xuất hiện tại Phòng 1

---

### 🚢 **PHÒNG 1 - Khởi hành (1911-1919)**

#### 🎨 Concept nghệ thuật
- **Màu chủ đạo**: Xanh biển, xanh da trời
- **Lighting**: Ánh sáng ban ngày, tươi sáng, đầy hy vọng
- **Mood**: Khát vọng, khởi đầu hành trình

#### 🏛️ Thiết kế không gian
```
        [Ảnh Nguyễn Tất Thành trẻ]
                    |
    [Cửa vào] ----[Trung tâm phòng]---- [Biển động]
        |              |                      |
    [Vali]      [Bản đồ thế giới]    [Tàu hơi nước]
                       |
              [Bản yêu sách Versailles]
                       |
                  [Cửa sang Phòng 2]
```

#### 📦 Vật thể tương tác

**1. Chiếc vali cũ 🧳**
- **Vị trí**: Gần cửa vào, bên trái
- **Model**: Vali da cũ kỹ, có dây buộc
- **Hiệu ứng hover**: Sáng lên viền vàng + tooltip "Chiếc vali của người thanh niên Nguyễn Tất Thành"
- **Khi click**:
  - Popup hiện lên với ảnh nền vali mở ra
  - **Text**: 
    > *"Tôi muốn đi ra ngoài xem nước khác làm như thế nào, rồi về giúp đồng bào."*  
    > — Nguyễn Tất Thành, 1911
  - **Audio**: Tiếng sóng biển nhẹ
  - **Icon**: Đánh dấu ✓ đã khám phá (1/3)

**2. Bản đồ thế giới 🗺️**
- **Vị trí**: Treo trên tường chính giữa, cao 1.5m
- **Model**: Bản đồ lớn phong cách cổ điển
- **Hiệu ứng hover**: Các quốc gia sáng lên nhẹ
- **Khi click**:
  - Animation: Đường màu đỏ vẽ dần theo lộ trình
    - Việt Nam → Pháp → Anh → Mỹ → Pháp → Liên Xô → Trung Quốc
  - **Text**: 
    > *"20 năm lang thang, qua 30 nước, 5 châu lục, tìm con đường cứu nước..."*
  - Mỗi điểm dừng có icon nhỏ + năm
  - **Icon**: ✓ (2/3)

**3. Bản yêu sách Versailles 📜**
- **Vị trí**: Bàn gỗ nhỏ, phía trước
- **Model**: Tờ giấy cũ kỹ, có chữ viết tay
- **Hiệu ứng hover**: Phóng to nhẹ
- **Khi click**:
  - Zoom vào tài liệu
  - **Text**:
    > *"Bản yêu sách của nhân dân An Nam (1919)"*  
    > 8 điểm yêu cầu (liệt kê ngắn gọn):
    > 1. Ân xá cho tù chính trị...
    > 2. Cải cách chế độ tư pháp...
    > *(Tóm tắt 8 điểm)*
  - **Note**: *"Khởi đầu con đường đấu tranh vạch mặt chủ nghĩa đế quốc"*
  - **Icon**: ✓ (3/3)

#### 🚪 Chuyển phòng
- **Điều kiện**: Đã khám phá 3/3 vật thể
- **Hiệu ứng**: 
  - Cửa phía sau phát sáng xanh dương
  - Text xuất hiện: *"Ánh sáng lý tưởng đang dần hé lộ..."*
  - Mũi tên chỉ đường nổi lên
- **Khi đi qua cửa**: Fade to light blue → Phòng 2

---

### 📚 **PHÒNG 2 - Ánh sáng Lênin (1920-1923)**

#### 🎨 Concept nghệ thuật
- **Màu chủ đạo**: Xanh đậm, tím than, ánh vàng từ sách
- **Lighting**: Spotlight chiếu vào cuốn sách ở trung tâm, ánh sáng qua cửa kính màu
- **Mood**: Khai sáng, tri thức, bước ngoặt

#### 🏛️ Thiết kế không gian
```
    [Cửa sổ kính màu - ánh sáng vàng]
                |
    [Giá sách cao] ---- [Bàn tròn trung tâm] ---- [Giá sách]
         |                    |                        |
    [Báo Le Paria]    [Luận cương Lênin]    [Ảnh Hội Liên hiệp]
                              |
                       [Cửa sang Phòng 3]
```

#### 📦 Vật thể tương tác

**1. Luận cương Lênin 📖**
- **Vị trí**: Trung tâm phòng, trên bàn tròn, có đế kính
- **Model**: Cuốn sách dày, bìa đỏ, phát sáng nhẹ
- **Hiệu ứng hover**: Ánh sáng vàng tỏa ra mạnh hơn
- **Khi click**:
  - Animation: Sách mở ra, ánh sáng chiếu khắp phòng (bloom effect)
  - **Text**:
    > *"Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa"*  
    > — V.I. Lênin, 1920
    
    > *"Muốn cứu nước và giải phóng dân tộc, không có con đường nào khác con đường cách mạng vô sản."*  
    > — Nguyễn Ái Quốc
  - **Audio**: Nhạc nền tăng dần, tiếng lật giấy
  - **Icon**: ✓ (1/3)

**2. Báo Le Paria 📰**
- **Vị trí**: Treo tường bên trái
- **Model**: Trang báo đóng khung, chữ Pháp cổ
- **Hiệu ứng hover**: Phóng to nhẹ
- **Khi click**:
  - Hiển thị trang báo đầu tiên (ảnh thật hoặc mockup)
  - **Text**:
    > *"Le Paria (Người Cùng Khổ) - 1922"*  
    > *"Vũ khí tư tưởng đầu tiên để tố cáo chủ nghĩa đế quốc Pháp và truyền bá tư tưởng cách mạng."*
  - Tiêu đề một số bài báo hiện lên (bằng tiếng Việt)
  - **Icon**: ✓ (2/3)

**3. Ảnh Hội Liên hiệp Thuộc địa 👥**
- **Vị trí**: Tường phải, ảnh đóng khung lớn
- **Model**: Ảnh đen trắng, nhóm người đứng cùng nhau
- **Hiệu ứng hover**: Highlight từng người
- **Khi click**:
  - Popup với ảnh phóng to
  - **Text**:
    > *"Hội Liên hiệp các Dân tộc Thuộc địa (1921)"*  
    > *"Nguyễn Ái Quốc tập hợp các chiến sĩ cách mạng từ các nước thuộc địa, đấu tranh chống chủ nghĩa đế quốc."*
  - Tên một số thành viên nổi bật
  - **Icon**: ✓ (3/3)

#### 🚪 Chuyển phòng
- **Điều kiện**: 3/3 vật thể
- **Hiệu ứng**: 
  - Ánh sáng từ sách tạo thành đường dẫn đến cửa
  - Cửa phát sáng cam nhẹ
  - Text: *"Hành trình tiếp tục đến lò rèn cách mạng..."*

---

### 🎓 **PHÒNG 3 - Quảng Châu: Lò đào tạo cách mạng (1924-1927)**

#### 🎨 Concept nghệ thuật
- **Màu chủ đạo**: Cam đất, nâu gỗ, vàng ấm
- **Lighting**: Ánh đèn dầu, bóng đổ mạnh
- **Mood**: Nghiêm túc, hun đúc, rèn luyện

#### 🏛️ Thiết kế không gian
```
           [Bảng đen - Sơ đồ tổ chức]
                    |
    [Bàn học] ---- [Bục giảng] ---- [Bàn học]
        |              |                |
    [Ghế gỗ]    [Mô hình NAQ]     [Ghế gỗ]
                       |
              [Sách Đường Kách mệnh]
                       |
                 [Cửa ra Phòng 4]
```

#### 📦 Vật thể tương tác

**1. Cuốn "Đường Kách mệnh" 📚**
- **Vị trí**: Bàn giảng, giữa phòng
- **Model**: Sách mỏng, bìa vàng cũ
- **Hiệu ứng hover**: Sáng vàng ấm
- **Khi click**:
  - Animation: Mở trang đầu, chữ hiện rõ dần
  - **Text**:
    > *"Đường Kách mệnh (1927)"*  
    > *"Cách mệnh là việc chung của cả dân chúng bị áp bức, chớ không phải là việc riêng của một ai."*  
    > — Nguyễn Ái Quốc
    
    > *"Tác phẩm nền tảng hướng dẫn thanh niên yêu nước đi đúng con đường cách mạng."*
  - **Icon**: ✓ (1/3)

**2. Bảng đen - Sơ đồ tổ chức 🪧**
- **Vị trí**: Phía trước phòng, treo cao
- **Model**: Bảng đen lớn, có sơ đồ vẽ bằng phấn trắng
- **Hiệu ứng hover**: Sơ đồ sáng dần từng phần
- **Khi click**:
  - Animation: Vẽ dần sơ đồ "Hội Việt Nam Cách mạng Thanh niên" (line draw effect)
  - **Text**:
    > *"Hội Việt Nam Cách mạng Thanh niên (6/1925)"*  
    > *"Tổ chức tiền thân của Đảng - chuẩn bị về tư tưởng, tổ chức và cán bộ."*
  - Hiện cấu trúc:
    - Ban Chấp hành
    - Ban Tuyên truyền
    - Ban Tổ chức
    - Các chi bộ trong nước
  - **Icon**: ✓ (2/3)

**3. Mô hình Nguyễn Ái Quốc 👨‍🏫**
- **Vị trí**: Bục giảng, đứng với tư thế giảng bài
- **Model**: Nhân vật 3D phong cách low-poly nghệ thuật
- **Hiệu ứng hover**: Ánh sáng nhấn mạnh
- **Khi click**:
  - **Audio**: Giọng đọc 10 giây (voice-over):
    > *"Các đồng chí phải hiểu rõ: cách mạng không phải chỉ là học thuyết, mà là hành động. Phải vào trong quần chúng, gần gũi với công nông, mới có thể lãnh đạo họ được."*
  - **Text caption** hiện đồng bộ
  - **Icon**: ✓ (3/3)

#### 🚪 Chuyển phòng
- **Điều kiện**: 3/3
- **Hiệu ứng**: 
  - Chữ trên bảng sáng đỏ rực
  - Camera nhẹ nhàng zoom vào chữ "Cách mạng"
  - Fade to red → Phòng 4

---

### 🔥 **PHÒNG 4 - Hội nghị Hương Cảng (Tháng 2/1930)**

#### 🎨 Concept nghệ thuật
- **Màu chủ đạo**: Đỏ rực, vàng sáng
- **Lighting**: Đèn treo trung tâm, bóng tối ở góc
- **Mood**: Khẩn trương, lịch sử, trọng đại

#### 🏛️ Thiết kế không gian
```
    [Lá cờ 1]    [Lá cờ 2]    [Lá cờ 3]
         \          |          /
          \         |         /
           [Bàn họp hình chữ nhật]
                    |
           [Ghế gỗ xung quanh]
                    |
          [Tài liệu Chính cương]
                    |
            [Khu vực sự kiện]
                    |
              [Cửa ra Phòng Kết]
```

#### 🎯 Sự kiện chính - Không phải vật thể đơn lẻ

**Kịch bản phòng đặc biệt:**
- Người chơi bước vào → camera tự động pan 360° chậm (3 giây) để quan sát toàn phòng
- **Xuất hiện popup trung tâm màn hình**:
  > *"Tháng 2/1930 - Hương Cảng, Trung Quốc"*  
  > *"Ba tổ chức cộng sản đang tồn tại: Đông Dương Cộng sản Đảng, An Nam Cộng sản Đảng, Đông Dương Cộng sản Liên đoàn."*  
  > *"Sự chia rẽ đang làm suy yếu phong trào. Đã đến lúc phải thống nhất!"*
  
- **Nút "BẮT ĐẦU HỢP NHẤT"** xuất hiện

#### 📦 Trình tự tương tác

**Bước 1: Click "Bắt đầu hợp nhất"**
- Animation: Camera zoom đến 3 lá cờ
- Âm thanh: Trống hội nghị nhẹ

**Bước 2: Hợp nhất**
- 3 lá cờ từ từ bay về trung tâm
- Hòa tan thành ánh sáng đỏ
- **Logo Đảng Cộng sản Việt Nam** (búa liềm) hiện ra, phát sáng rực rỡ
- Hiệu ứng: Light flare, particle vàng bay rơi

**Bước 3: Thông báo lịch sử**
- Popup lớn giữa màn hình:
  > **🎉 ĐẢNG CỘNG SẢN VIỆT NAM RA ĐỜI 🎉**  
  > *3 tháng 2 năm 1930*
  
  > *"Đây là kết quả của 20 năm chuẩn bị về tư tưởng, tổ chức, cán bộ của Nguyễn Ái Quốc và toàn thể phong trào cách mạng."*
  
  > *"Một bước ngoặt vĩ đại trong lịch sử dân tộc Việt Nam."*

- **Audio**: "Tiến quân ca" vang lên (30 giây đầu)

**Bước 4: Hiển thị tài liệu**
- Tự động hiện 3 văn kiện dưới dạng icon nhỏ có thể click:
  1. **Chánh cương vắn tắt**
  2. **Sách lược vắn tắt**
  3. **Điều lệ vắn tắt**
- Click vào từng văn kiện → popup với nội dung tóm tắt ngắn gọn

**Bước 5: Tiếp tục**
- Nút **"XEM Ý NGHĨA LỊCH SỬ"**
- Click → fade to gold light → Phòng Kết

---

### 🇻🇳 **PHÒNG KẾT - Kỷ nguyên mới**

#### 🎨 Concept nghệ thuật
- **Màu chủ đạo**: Đỏ - vàng rực rỡ, bầu trời sáng
- **Lighting**: Ánh sáng mặt trời chiếu qua lá cờ
- **Mood**: Chiến thắng, tự hào, hi vọng

#### 🏛️ Thiết kế không gian
```
           [Bầu trời sáng]
                |
         [Lá cờ Việt Nam khổng lồ tung bay]
                |
        [Bản đồ Việt Nam phát sáng]
                |
       [Tường danh ngôn Hồ Chí Minh]
                |
      [Nút "Kết thúc tham quan"]
```

#### 📜 Nội dung

**1. Không gian mở**
- Không phải phòng kín, mà là không gian outdoor rộng lớn
- Lá cờ Việt Nam (đỏ sao vàng) lớn tung bay ở trung tâm (animation cloth physics)
- Bản đồ Việt Nam 3D sáng rực phía dưới
- Ánh sáng vàng tỏa ra khắp nơi

**2. Tường danh ngôn**
- 3-4 câu danh ngôn của Hồ Chí Minh khắc trên tấm bia đá:
  - *"Đảng ta là đạo đức, là văn minh"*
  - *"Không có gì quý hơn độc lập, tự do"*
  - *"Đoàn kết, đoàn kết, đại đoàn kết / Thành công, thành công, đại thành công"*
- Hover vào từng câu → sáng lên + hiệu ứng vàng

**3. Text chạy nền**
- Hiển thị ở phía dưới màn hình:
  > *"Sự ra đời của Đảng Cộng sản Việt Nam là bước ngoặt vĩ đại trong lịch sử dân tộc."*
  
  > *"Chấm dứt thời kỳ khủng hoảng về đường lối cứu nước. Mở ra kỷ nguyên mới: Độc lập dân tộc gắn liền với chủ nghĩa xã hội."*

**4. Âm thanh**
- "Tiến quân ca" full version phát nhẹ ở nền
- Tiếng gió, cờ bay phất phơ

**5. Nút kết thúc**
- **"KẾT THÚC THAM QUAN"**: Ở giữa màn hình
- Click → fade to black → Credits → Quay về Home Screen

---

## 5. HỆ THỐNG TƯƠNG TÁC

### 🎮 UI/UX trong game

#### HUD (Head-Up Display)
```
┌─────────────────────────────────────────┐
│  🏛️ Bảo tàng Nguyễn Ái Quốc           🔊│
│                                     [Icon]│
│                                           │
│                                           │
││                                           │
│                                           │
│                                           │
│                                           │
│                                           │
│  [Phòng: Khởi hành]  [Tiến trình: 2/3]   │
│                                           │
│  💡 Di chuyển: WASD | Xoay: Chuột        │
│  ⚡ Tương tác: Click chuột               │
└─────────────────────────────────────────┘
```

#### Các thành phần HUD

**1. Thanh trên cùng (Header)**
- **Trái**: Tên bảo tàng + icon 🏛️
- **Phải**: 
  - Icon âm thanh 🔊 (click để bật/tắt)
  - Icon home 🏠 (về trang chủ - có xác nhận)
  - Icon help ❓ (hướng dẫn điều khiển)

**2. Thanh dưới cùng (Footer)**
- **Trái**: Tên phòng hiện tại
- **Giữa**: Tiến trình khám phá (vd: 2/3 vật thể)
- **Phải**: Gợi ý điều khiển (hiện khi cần)

**3. Crosshair (Dấu ngắm giữa màn hình)**
- Hình tròn nhỏ, màu trắng mờ
- Khi hover vào vật thể tương tác được:
  - Đổi màu vàng
  - Phóng to nhẹ
  - Hiện tên vật thể bên cạnh

### 🖱️ Feedback hệ thống

#### Khi hover vật thể
- Outline vàng/trắng xuất hiện quanh vật thể
- Tooltip hiện tên (vd: "Chiếc vali cũ")
- Cursor đổi thành icon hand ☝️
- Âm thanh: Tiếng "tick" nhẹ

#### Khi click tương tác
- Hiệu ứng: Flash trắng nhẹ
- Âm thanh: "Click" xác nhận
- Popup/Modal xuất hiện mượt mà (fade-in 0.3s)
- Background làm mờ (blur effect)

#### Khi hoàn thành vật thể
- Icon ✓ màu xanh lá bay vào thanh tiến trình
- Âm thanh: "Ding" thành tựu
- Text "+1" hiện thoáng qua
- Số đếm tăng lên (2/3 → 3/3)

#### Khi mở cửa phòng mới
- Hiệu ứng: Cửa phát sáng + particle
- Âm thanh: Tiếng cửa mở lớn
- Mũi tên chỉ đường nổi bật
- Text thông báo hiện trung tâm (3 giây)

### 📱 Popup/Modal Design

#### Cấu trúc popup tiêu chuẩn
```
┌──────────────────────────────────┐
│  [X]                             │
│                                  │
│  ╔════════════════════════════╗  │
│  ║                            ║  │
│  ║     [Hình ảnh/Icon]       ║  │
│  ║                            ║  │
│  ╚════════════════════════════╝  │
│                                  │
│  ┌────────────────────────────┐ │
│  │  TIÊU ĐỀ VẬT THỂ          │ │
│  └────────────────────────────┘ │
│                                  │
│  Nội dung mô tả chi tiết...     │
│  Lorem ipsum dolor sit amet...  │
│                                  │
│  > Trích dẫn nếu có              │
│                                  │
│       [ĐÓNG] hoặc [TIẾP TỤC]   │
└──────────────────────────────────┘
```

#### Style popup
- **Background**: Semi-transparent đen (#000000, opacity 80%)
- **Popup box**: Trắng/kem (#FFF9E6) với border vàng (#FFD700)
- **Font**: 
  - Tiêu đề: **Montserrat Bold, 24px**
  - Nội dung: **Noto Sans Vietnamese Regular, 16px**
  - Trích dẫn: *Noto Serif Vietnamese Italic, 18px*
- **Padding**: 30px
- **Max width**: 600px
- **Border radius**: 10px
- **Shadow**: 0 10px 40px rgba(0,0,0,0.3)

---

## 6. THIẾT KẾ GIAO DIỆN

### 🎨 Color Palette

#### Palette chính
| Màu | Hex Code | Sử dụng |
|-----|----------|---------|
| **Đỏ cách mạng** | `#C62828` | Logo Đảng, Phòng 4, nút CTA |
| **Vàng sao** | `#FFD54F` | Highlight, icon, ánh sáng |
| **Trắng kem** | `#FFF9E6` | Background popup, text |
| **Đen than** | `#121212` | Nền tối, text chính |
| **Xanh biển** | `#1976D2` | Phòng 1, nước biển |
| **Xanh đậm** | `#283593` | Phòng 2, tri thức |
| **Cam đất** | `#EF6C00` | Phòng 3, rèn luyện |

#### Gradient sử dụng
```css
/* Header gradient */
background: linear-gradient(135deg, #C62828 0%, #FFD54F 100%);

/* Light effect */
background: radial-gradient(circle, #FFD54F 0%, transparent 70%);

/* Transition giữa phòng */
background: linear-gradient(to bottom, [màu phòng cũ], [màu phòng mới]);
```

### 🖼️ Typography

#### Font chính
```css
/* Tiêu đề */
font-family: 'Montserrat', sans-serif;
font-weight: 700;
font-size: 32px;
color: #C62828;

/* Body text */
font-family: 'Noto Sans Vietnamese', sans-serif;
font-weight: 400;
font-size: 16px;
line-height: 1.6;
color: #121212;

/* Trích dẫn */
font-family: 'Noto Serif Vietnamese', serif;
font-style: italic;
font-size: 18px;
color: #424242;
```

### 🎭 Icon Set

#### Icons cần thiết
| Icon | Mô tả | Vị trí |
|------|-------|--------|
| 🏛️ | Museum | Header |
| 🔊/🔇 | Sound on/off | Header |
| 🏠 | Home | Header |
| ❓ | Help | Header |
| ⚡ | Interact | Tooltip |
| ✓ | Completed | Progress |
| 🚪 | Door unlock | Notification |
| 💡 | Hint | Helper |

---

## 7. ÂM THANH VÀ HIỆU ỨNG

### 🎵 Hệ thống âm thanh

#### Âm nhạc nền (Background Music)

| Phòng | Nhạc nền | Mood | Volume |
|-------|----------|------|--------|
| **Home** | "Tiến quân ca" (Piano version) | Trang trọng, khởi đầu | 40% |
| **Phòng 1** | "Hành khúc thanh niên" (Instrumental) | Hào hứng, khát vọng | 35% |
| **Phòng 2** | Classical piano nhẹ (Bach/Chopin style) | Tĩnh lặng, tri thức | 30% |
| **Phòng 3** | Traditional Vietnamese flute (Sáo trúc) | Nghiêm túc, dân tộc | 35% |
| **Phòng 4** | Drum roll + "Tiến quân ca" (build-up) | Hồi hộp, trọng đại | 50% |
| **Phòng Kết** | "Tiến quân ca" (Full orchestral) | Hùng tráng, chiến thắng | 60% |

#### Âm thanh môi trường (Ambient Sound)

**Phòng 1 - Khởi hành:**
- Sóng biển vỗ nhẹ (loop)
- Tiếng tàu còi xa xa
- Tiếng gió biển
- Volume: 20-25%

**Phòng 2 - Thư viện:**
- Tiếng lật trang sách
- Tiếng đồng hồ cổ tích tắc
- Gió nhẹ qua cửa sổ
- Volume: 15-20%

**Phòng 3 - Lớp học:**
- Tiếng phấn viết trên bảng
- Giọng giảng bài xa xa (muffled)
- Tiếng chim hót ngoài cửa sổ
- Volume: 15-20%

**Phòng 4 - Phòng họp:**
- Tiếng trống hội nghị nhẹ
- Thì thầm người họp
- Volume: 10-15%

#### Âm thanh tương tác (SFX)

| Hành động | Âm thanh | Mô tả |
|-----------|----------|-------|
| Hover vật thể | Soft tick | Ngắn, 0.1s |
| Click vật thể | Click confirm | Giòn, 0.2s |
| Popup mở | Whoosh + chime | Mượt mà, 0.5s |
| Hoàn thành vật thể | Achievement ding | Vui vẻ, 0.3s |
| Cửa mở | Large door open | Hùng tráng, 2s |
| Chuyển phòng | Transition swoosh | Êm ái, 1.5s |
| Hợp nhất logo | Triumphant fanfare | Oai vệ, 3s |

#### Voice-over (Nếu có ngân sách)

**Phòng 3 - Mô hình Nguyễn Ái Quốc:**
- Giọng đọc nam, trầm ấm, rõ ràng
- Độ dài: 10 giây
- Nội dung: Trích dẫn bài giảng của Người

**Tùy chọn mở rộng:**
- Narrator giới thiệu mỗi phòng (5-7 giây/phòng)
- Tổng cộng: ~30-40 giây voice-over

### 💫 Hiệu ứng hình ảnh (Visual Effects)

#### Particle Systems

**1. Ánh sáng tri thức (Phòng 2):**
```
- Type: Glowing particles
- Shape: Spherical emission
- Color: Yellow → White gradient
- Speed: Slow float upward
- Lifetime: 3-5 seconds
- Count: 50-80 particles
```

**2. Cờ hợp nhất (Phòng 4):**
```
- Type: Light trails
- Shape: Converging lines
- Color: Red → Yellow
- Speed: Medium
- Lifetime: 2 seconds
- Count: 100+ particles
- Effect: Bloom + light flare
```

**3. Kỷ nguyên mới (Phòng Kết):**
```
- Type: Confetti/sparkles
- Shape: Random scatter
- Color: Red + Yellow mix
- Speed: Falling with wind
- Lifetime: 4-6 seconds
- Count: 200+ particles
```

#### Post-Processing Effects

**Bloom (Ánh sáng phát quang):**
- Phòng 2: Intensity 0.8 (sách Lênin)
- Phòng 4: Intensity 1.2 (logo Đảng)
- Phòng Kết: Intensity 1.5 (lá cờ)

**Vignette (Làm tối viền):**
- Áp dụng nhẹ cho tất cả phòng: Intensity 0.3
- Tăng lên 0.5 khi popup mở

**Depth of Field (Độ sâu trường ảnh):**
- Khi tương tác vật thể: blur background
- Focus distance: 2-3m
- Blur intensity: Medium

**Color Grading:**
- Phòng 1: Tăng blue/cyan (+15%)
- Phòng 2: Tăng contrast (+10%)
- Phòng 3: Tăng warm tone (+20%)
- Phòng 4: Tăng saturation red (+30%)

---

## 8. CÔNG NGHỆ VÀ TRIỂN KHAI

### 🛠️ Tech Stack

#### Core Framework
```
┌─────────────────────────────────────┐
│         A-Frame 1.4.0               │
│    (WebXR + Three.js wrapper)       │
├─────────────────────────────────────┤
│         Three.js r150+              │
│      (3D rendering engine)          │
├─────────────────────────────────────┤
│      JavaScript ES6+                │
│     (Game logic & interaction)      │
├─────────────────────────────────────┤
│      HTML5 + CSS3                   │
│    (UI overlay & styling)           │
└─────────────────────────────────────┘
```

#### Libraries & Plugins

**A-Frame Components:**
- `aframe-extras` - Movement controls
- `aframe-environment-component` - Sky/ground
- `aframe-particle-system-component` - Particles
- `aframe-event-set-component` - Interactions

**Additional Libraries:**
- **GSAP (GreenSock)** - Advanced animations
- **Howler.js** - Audio management
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### 📁 Cấu trúc thư mục

```
nguyen-ai-quoc-museum/
│
├── index.html                 # Main entry point
├── README.md                  # Documentation
│
├── assets/
│   ├── models/                # 3D models (.glb, .gltf)
│   │   ├── suitcase.glb
│   │   ├── book.glb
│   │   ├── flag.glb
│   │   └── ...
│   │
│   ├── textures/              # Image textures
│   │   ├── wood.jpg
│   │   ├── flag-texture.png
│   │   └── ...
│   │
│   ├── images/                # UI images, photos
│   │   ├── nguyen-ai-quoc.jpg
│   │   ├── versailles.jpg
│   │   ├── lenin-document.jpg
│   │   └── ...
│   │
│   ├── audio/                 # Sound files
│   │   ├── bgm/
│   │   │   ├── home.mp3
│   │   │   ├── room1.mp3
│   │   │   └── ...
│   │   ├── sfx/
│   │   │   ├── click.wav
│   │   │   ├── door-open.wav
│   │   │   └── ...
│   │   └── voice/
│   │       └── naq-speech.mp3
│   │
│   └── fonts/                 # Web fonts
│       ├── Montserrat/
│       └── NotoSans/
│
├── src/
│   ├── components/            # A-Frame custom components
│   │   ├── room-manager.js
│   │   ├── interactive-object.js
│   │   ├── progress-tracker.js
│   │   └── transition-effect.js
│   │
│   ├── scenes/                # Scene configurations
│   │   ├── home.js
│   │   ├── room1.js
│   │   ├── room2.js
│   │   ├── room3.js
│   │   ├── room4.js
│   │   └── ending.js
│   │
│   ├── utils/                 # Utility functions
│   │   ├── audio-manager.js
│   │   ├── ui-controller.js
│   │   └── storage.js
│   │
│   └── main.js                # Main app logic
│
├── styles/
│   ├── main.css               # Global styles
│   ├── popup.css              # Modal/popup styles
│   └── hud.css                # HUD overlay styles
│
└── docs/
    ├── design-document.md     # This document
    ├── asset-list.xlsx        # Asset inventory
    └── storyboard.pdf         # Visual storyboard
```

### 🎬 Code Example - Interactive Object

```javascript
// src/components/interactive-object.js

AFRAME.registerComponent('interactive-object', {
  schema: {
    objectId: {type: 'string'},
    title: {type: 'string'},
    description: {type: 'string'},
    image: {type: 'string'},
    audioFile: {type: 'string', default: ''},
    completed: {type: 'boolean', default: false}
  },

  init: function() {
    this.el.addEventListener('mouseenter', () => {
      this.onHover();
    });
    
    this.el.addEventListener('mouseleave', () => {
      this.onLeave();
    });
    
    this.el.addEventListener('click', () => {
      this.onClick();
    });
  },

  onHover: function() {
    // Highlight effect
    this.el.setAttribute('material', 'emissive', '#FFD54F');
    this.el.setAttribute('material', 'emissiveIntensity', 0.5);
    
    // Show tooltip
    document.getElementById('tooltip').textContent = this.data.title;
    document.getElementById('tooltip').style.display = 'block';
    
    // Play hover sound
    document.getElementById('sfx-hover').play();
  },

  onLeave: function() {
    // Remove highlight
    this.el.setAttribute('material', 'emissive', '#000000');
    this.el.setAttribute('material', 'emissiveIntensity', 0);
    
    // Hide tooltip
    document.getElementById('tooltip').style.display = 'none';
  },

  onClick: function() {
    if (this.data.completed) return;
    
    // Play click sound
    document.getElementById('sfx-click').play();
    
    // Show popup
    this.showPopup();
    
    // Mark as completed
    this.data.completed = true;
    
    // Update progress
    this.el.sceneEl.emit('object-completed', {
      objectId: this.data.objectId
    });
  },

  showPopup: function() {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupDesc = document.getElementById('popup-description');
    const popupImage = document.getElementById('popup-image');
    
    popupTitle.textContent = this.data.title;
    popupDesc.textContent = this.data.description;
    popupImage.src = this.data.image;
    
    popup.style.display = 'flex';
    
    // Play audio if available
    if (this.data.audioFile) {
      const audio = new Audio(this.data.audioFile);
      audio.play();
    }
  }
});
```

### 🌐 Deployment Options

#### Option 1: GitHub Pages (Recommended)
```bash
# Free, easy, perfect for static sites
1. Push code to GitHub repository
2. Settings → Pages → Enable
3. Access at: username.github.io/museum-name
```

**Pros:**
- ✅ Miễn phí
- ✅ Dễ setup
- ✅ Tự động deploy khi push code
- ✅ HTTPS mặc định

**Cons:**
- ⚠️ Giới hạn file size (100MB/file)
- ⚠️ Chỉ cho static site

#### Option 2: Netlify
```bash
# Drag & drop deployment
1. Kéo thả folder vào Netlify
2. Tự động deploy
3. Custom domain miễn phí
```

**Pros:**
- ✅ Miễn phí tier rộng rãi
- ✅ Tốc độ load nhanh (CDN)
- ✅ Continuous deployment
- ✅ Preview deploy

#### Option 3: Vercel
**Pros:**
- ✅ Tối ưu cho các framework hiện đại
- ✅ Analytics built-in
- ✅ Edge functions

### 🎯 Performance Optimization

#### 3D Models
- **Format**: GLB (binary GLTF) - nhỏ gọn nhất
- **Polygon count**: Giữ dưới 5000 tris/model
- **Texture size**: 1024x1024 max (hoặc 512x512)
- **Compression**: Draco compression cho GLB

#### Textures
- **Format**: WebP (nếu browser support), fallback JPG
- **Compression**: 80% quality
- **Atlas**: Combine nhiều texture nhỏ thành 1 atlas lớn

#### Audio
- **Format**: MP3 (compatibility) hoặc OGG
- **Bitrate**: 128kbps cho BGM, 64kbps cho SFX
- **Preload**: Chỉ preload audio cần thiết ngay

#### Code
- **Minify**: HTML, CSS, JS
- **Bundle**: Webpack hoặc Rollup
- **Lazy load**: Load assets theo từng phòng

**Target Performance:**
- FPS: 60fps stable (hoặc 30fps minimum)
- Load time: < 5 giây (first room)
- File size tổng: < 50MB

---

## 9. PHÂN CÔNG NHÓM

### 👥 Cấu trúc team (5-6 người)

```
        [Project Manager/Lead]
                 |
    ┌────────────┼────────────┐
    │            │            │
[Design]    [Development]  [Content]
    │            │            │
    ├──UI/UX     ├──3D Dev    ├──Writer
    └──3D Art    ├──Frontend  └──QA/Test
                 └──Audio
```

### 📋 Chi tiết vai trò

#### **1. Project Manager / Lead (1 người)**
**Trách nhiệm:**
- Lập kế hoạch timeline tổng thể
- Phân công công việc chi tiết
- Họp team hàng tuần
- Theo dõi tiến độ
- Giải quyết xung đột/vấn đề
- Chuẩn bị tài liệu demo/trình bày

**Deliverables:**
- Project timeline (Gantt chart)
- Weekly status report
- Final presentation slides

**Tools:**
- Trello/Notion (task management)
- Google Docs (documentation)
- Slack/Discord (communication)

---

#### **2. UI/UX Designer (1 người)**
**Trách nhiệm:**
- Thiết kế giao diện popup/modal
- Design HUD layout
- Tạo mockup từng màn hình
- Chọn color palette & typography
- Design icons
- Tạo loading screen/transition

**Deliverables:**
- Figma/Adobe XD mockups
- Style guide document
- Icon set (SVG)
- UI sprite sheets

**Tools:**
- Figma / Adobe XD
- Illustrator (icons)
- Photoshop (textures)

**Timeline:**
- Week 1: Research & wireframe
- Week 2: High-fidelity mockup
- Week 3: Iteration based on feedback

---

#### **3. 3D Artist (1 người)**
**Trách nhiệm:**
- Tìm/tạo 3D models cho vật thể
- Texture và material setup
- Tối ưu models (polygon reduction)
- Tạo environment props
- Lighting setup cho từng phòng

**Deliverables:**
- GLB/GLTF files cho tất cả models
- Texture atlas
- Lighting configuration document

**Assets cần tạo/tìm:**
- Vali, bản đồ, tài liệu (Phòng 1)
- Sách, báo, khung ảnh (Phòng 2)
- Bàn học, bảng đen, sách (Phòng 3)
- Bàn họp, cờ, logo (Phòng 4)
- Lá cờ lớn, tượng đài (Phòng Kết)

**Tools:**
- Blender (free) hoặc Maya
- Substance Painter (texturing)
- Sketchfab (asset download)

**Timeline:**
- Week 1: Asset list + sourcing
- Week 2-3: Modeling & texturing
- Week 4: Optimization & export

---

#### **4. 3D Developer (2 người)**
**Trách nhiệm:**

**Dev 1 - Scene Builder:**
- Setup A-Frame scenes
- Implement room layouts
- Camera movement & controls
- Door transition logic
- Environment setup (sky, ground, lighting)

**Dev 2 - Interaction Developer:**
- Interactive object components
- Popup/modal system
- Progress tracking system
- Audio management
- Event system (object → UI)

**Shared:**
- Code review lẫn nhau
- Debug & testing
- Performance optimization

**Deliverables:**
- Working prototype (Week 2)
- Alpha build (Week 3)
- Beta build (Week 4)
- Final build + bug fixes (Week 5)

**Tools:**
- VS Code
- A-Frame + Three.js
- Git/GitHub (version control)
- Chrome DevTools

**Timeline:**
- Week 1: Setup environment + basic structure
- Week 2: Implement Room 1-2
- Week 3: Implement Room 3-4 + Ending
- Week 4: Polish + bug fixes
- Week 5: Final testing

---

#### **5. Content Writer (1 người)**
**Trách nhiệm:**
- Viết content cho tất cả popup
- Soạn trích dẫn lịch sử chính xác
- Viết text hướng dẫn/tutorial
- Proofread tất cả text
- Đảm bảo tính xác thực lịch sử
- Viết credits & about section

**Deliverables:**
- Content spreadsheet (tất cả text trong game)
- Historical reference document
- Tutorial/help text
- Final proofread report

**Content cần viết:**
- 12+ popup descriptions (3-4 per room)
- 4 room introduction texts
- Ending narration
- UI labels & buttons
- Tooltip text

**Timeline:**
- Week 1: Research historical facts
- Week 2: Draft all content
- Week 3: Review & edit
- Week 4: Final proofread

---

#### **6. Audio Engineer / QA Tester (1 người)**
**Trách nhiệm:**

**Audio (50%):**
- Tìm/tạo background music
- Sound effects library
- Audio editing & mixing
- Implement audio in code
- Volume balancing

**QA/Testing (50%):**
- Test trên nhiều browsers
- Test trên nhiều devices
- Bug reporting
- User testing (gather feedback)
- Performance testing

**Deliverables:**
- Audio files (MP3/OGG)
- Bug report document
- Test cases checklist
- User feedback summary

**Tools:**
- Audacity (audio editing)
- Freesound.org (SFX)
- Chrome/Firefox/Safari (testing)
- Google Forms (user survey)

**Timeline:**
- Week 1-2: Audio sourcing & editing
- Week 3: Audio implementation
- Week 4-5: Intensive testing

---

### 📅 Timeline tổng thể (5 tuần)

```
Week 1: PRE-PRODUCTION
├─ PM: Project setup, task assignment
├─ Designer: Research, wireframe
├─ 3D Artist: Asset list, sourcing
├─ Dev: Environment setup, basic structure
├─ Writer: Historical research
└─ Audio/QA: Music sourcing

Week 2: PRODUCTION - Phase 1
├─ Designer: High-fidelity mockups
├─ 3D Artist: Modeling Room 1-2 assets
├─ Dev: Implement Room 1-2
├─ Writer: Draft all content
└─ Audio/QA: Sound effects

Week 3: PRODUCTION - Phase 2
├─ Designer: UI implementation support
├─ 3D Artist: Modeling Room 3-4 assets
├─ Dev: Implement Room 3-4 + Ending
├─ Writer: Content review & edit
└─ Audio/QA: Audio implementation

Week 4: POLISH
├─ PM: Internal demo, feedback collection
├─ Designer: UI polish
├─ 3D Artist: Optimization
├─ Dev: Bug fixes, effects polish
├─ Writer: Final proofread
└─ Audio/QA: Intensive testing

Week 5: FINAL
├─ PM: Presentation prep
├─ All: Final bug fixes
├─ Dev: Deployment
├─ Audio/QA: Final user testing
└─ PM: Documentation & delivery
```

### 🔄 Communication Protocol

**Daily:**
- Quick standup (5 phút) qua Discord/Slack
- Update progress trên Trello

**Weekly:**
- Team meeting (30-45 phút)
- Demo current build
- Review timeline

**Tools:**
- **Trello**: Task management
- **Discord/Slack**: Daily communication
- **Google Drive**: Document sharing
- **GitHub**: Code collaboration
- **Figma**: Design collaboration

---

## 10. KẾT LUẬN & MỞ RỘNG

### ✨ Tóm tắt dự án

**"Bảo tàng Ảo Nguyễn Ái Quốc"** là một mini game giáo dục tương tác, kết hợp:
- ✅ Công nghệ 3D web

- ✅ Nội dung lịch sử chính xác và có giá trị giáo dục
- ✅ Trải nghiệm người dùng mượt mà, dễ tiếp cận
- ✅ Thiết kế nghệ thuật đẹp mắt, có ý nghĩa
- ✅ Gameplay đơn giản nhưng hấp dẫn

**Mục tiêu cuối cùng:**
> Giúp thế hệ trẻ hiểu rõ và trân trọng hành trình chuẩn bị vĩ đại của Nguyễn Ái Quốc cho sự ra đời của Đảng Cộng sản Việt Nam, thông qua một phương thức hiện đại, tương tác và gần gũi.

---

### 🚀 Các tính năng có thể mở rộng (Phase 2)

#### **1. Chế độ VR (Virtual Reality)**
**Mô tả:**
- Hỗ trợ kính VR (Oculus Quest, HTC Vive, Google Cardboard)
- Sử dụng WebXR API (A-Frame có sẵn)
- Điều khiển bằng tay cầm VR controllers

**Implementation:**
```html
<a-scene vr-mode-ui="enabled: true">
  <!-- Existing content -->
</a-scene>
```

**Lợi ích:**
- Trải nghiệm immersive hơn
- Thu hút người chơi trẻ tuổi
- Phù hợp cho các buổi triển lãm công nghệ

---

#### **2. Chế độ Quiz/Minigame**
**Mô tả:**
- Sau mỗi phòng, có 2-3 câu hỏi trắc nghiệm
- Trả lời đúng → mở khóa achievement/badge
- Tính điểm tổng kết

**Câu hỏi ví dụ (Phòng 1):**
> *"Nguyễn Tất Thành rời Việt Nam năm nào?"*
> - A) 1909
> - B) **1911** ✓
> - C) 1913
> - D) 1915

**Lợi ích:**
- Tăng tính tương tác
- Kiểm tra kiến thức người chơi
- Khuyến khích chơi lại để đạt điểm cao

---

#### **3. Hệ thống Achievement/Badge**
**Mô tả:**
- Thu thập huy hiệu khi hoàn thành mốc quan trọng
- Hiển thị trong "Collection" section

**Achievements ví dụ:**
- 🏆 **"Nhà khám phá"** - Tương tác với tất cả vật thể
- 📚 **"Học giả"** - Đọc hết tất cả trích dẫn
- ⏱️ **"Tốc hành"** - Hoàn thành dưới 5 phút
- 🎯 **"Hoàn hảo"** - Trả lời đúng 100% quiz
- 🌟 **"Sử học trẻ"** - Unlock tất cả achievement

**Implementation:**
- LocalStorage để lưu progress
- JSON structure:
```json
{
  "achievements": {
    "explorer": true,
    "scholar": false,
    "speedrunner": true
  },
  "score": 850,
  "completionTime": 420
}
```

---

#### **4. Multiplayer/Social Features**
**Mô tả:**
- Cho phép nhiều người tham quan cùng lúc
- Hiện avatar của người khác trong không gian 3D
- Chat đơn giản

**Tech:**
- Socket.io hoặc WebRTC
- Networked-aframe component

**Use cases:**
- Giáo viên dẫn học sinh tham quan chung
- Nhóm bạn khám phá cùng nhau

---

#### **5. Chế độ "Guided Tour"**
**Mô tả:**
- Có narrator giọng nói hướng dẫn tự động
- Camera di chuyển tự động đến từng điểm
- Người dùng chỉ cần nghe và xem

**Lợi ích:**
- Phù hợp cho người không thích tự khám phá
- Giống tour thật ở bảo tàng
- Accessibility cho người khuyết tật

---

#### **6. Behind-the-Scenes Content**
**Mô tả:**
- Phòng bonus với hậu trường làm game
- Concept art, storyboard
- Interview team members
- Making-of video

**Vị trí:**
- Cửa bí mật ở phòng Home
- Unlock sau khi hoàn thành game 100%

---

#### **7. Language Support**
**Mô tả:**
- Thêm tiếng Anh, tiếng Pháp
- Dễ dàng i18n với JSON files

**Structure:**
```javascript
// lang/vi.json
{
  "home.title": "Bảo tàng Ảo Nguyễn Ái Quốc",
  "room1.suitcase.title": "Chiếc vali cũ",
  ...
}

// lang/en.json
{
  "home.title": "Virtual Museum of Nguyễn Ái Quốc",
  "room1.suitcase.title": "The Old Suitcase",
  ...
}
```

---

#### **8. Mobile App Version**
**Mô tả:**
- Đóng gói thành mobile app (React Native / Cordova)
- AR mode: scan QR code tại địa điểm thật để mở content

**Platforms:**
- iOS (App Store)
- Android (Google Play)

---

#### **9. Educational Dashboard (For Teachers)**
**Mô tả:**
- Trang quản lý cho giáo viên
- Xem progress của học sinh
- Export báo cáo

**Features:**
- Student analytics
- Completion rates
- Quiz scores
- Time spent per room

**Tech:**
- Backend: Node.js + MongoDB
- Frontend: React dashboard

---

#### **10. Integration với trang web/kiosk bảo tàng thật**
**Mô tả:**
- Tích hợp vào website bảo tàng Hồ Chí Minh
- Tạo kiosk tương tác tại bảo tàng thật
- QR code tại tượng đài/bia kỷ niệm

**Use cases:**
- Du khách tham quan trước khi đến bảo tàng thật
- Học sinh ôn tập sau chuyến tham quan
- Người không thể đến trực tiếp vẫn trải nghiệm được

---

### 📊 Success Metrics (Đo lường thành công)

#### **KPIs - Key Performance Indicators**

**1. Technical Performance:**
- ✅ FPS ≥ 30 (mobile), ≥ 60 (desktop)
- ✅ Load time < 8 giây
- ✅ Crash rate < 1%
- ✅ Compatible với 95% browsers (Chrome, Firefox, Safari, Edge)

**2. User Engagement:**
- ✅ Completion rate ≥ 70% (người chơi hoàn thành tất cả phòng)
- ✅ Average session time: 8-12 phút
- ✅ Interaction rate: Trung bình ≥ 10/12 vật thể được click
- ✅ Return rate: ≥ 20% người chơi lại

**3. Educational Impact:**
- ✅ User survey: ≥ 80% hiểu rõ hơn về Nguyễn Ái Quốc
- ✅ Quiz average score ≥ 75%
- ✅ Positive feedback rate ≥ 85%

**4. Reach:**
- ✅ Target: 500+ users trong tháng đầu (nếu public)
- ✅ Social shares ≥ 50
- ✅ Press mentions ≥ 3 (báo, blog giáo dục)

---

### 🎓 Giá trị giáo dục & Đóng góp

#### **Về mặt học thuật:**
1. **Phương pháp học tập mới:**
   - Experiential learning (học qua trải nghiệm)
   - Gamification trong giáo dục lịch sử
   - Thay thế bài giảng truyền thống

2. **Accessibility:**
   - Miễn phí, dễ tiếp cận
   - Không cần cài đặt
   - Chạy trên mọi thiết bị có browser

3. **Engagement:**
   - Tăng hứng thú với lịch sử
   - Phù hợp Gen Z, Gen Alpha
   - Tạo ấn tượng sâu sắc hơn sách vở

#### **Về mặt xã hội:**
1. **Bảo tồn lịch sử:**
   - Số hóa di sản văn hóa
   - Lan tỏa giá trị lịch sử đến đông đảo

2. **Công nghệ vì cộng đồng:**
   - Ứng dụng công nghệ vào giáo dục
   - Mô hình có thể nhân rộng cho các chủ đề khác

3. **Trách nhiệm xã hội:**
   - Giáo dục thế hệ trẻ về truyền thống cách mạng
   - Gìn giữ bản sắc dân tộc trong thời đại số

---

### 📝 Checklist hoàn thiện dự án

```
□ DESIGN
  □ UI mockups (Figma) - 100%
  □ 3D models sourced/created - 100%
  □ Textures prepared - 100%
  □ Icon set completed - 100%
  
□ DEVELOPMENT
  □ Scene setup (all rooms) - 100%
  □ Movement controls - 100%
  □ Interactive objects - 100%
  □ Popup system - 100%
  □ Progress tracking - 100%
  □ Transitions - 100%
  □ Audio integration - 100%
  
□ CONTENT
  □ All text written - 100%
  □ Historical accuracy verified - 100%
  □ Proofreading - 100%
  □ Images sourced - 100%
  
□ TESTING
  □ Browser testing (Chrome, Firefox, Safari, Edge)
  □ Device testing (Desktop, tablet, mobile)
  □ Performance testing (FPS, load time)
  □ User testing (3-5 người)
  □ Bug fixes
  
□ POLISH
  □ Visual effects tuning
  □ Audio mixing & balancing
  □ Loading screen
  □ Credits screen
  
□ DEPLOYMENT
  □ Code minified
  □ Assets optimized
  □ Deployed to hosting
  □ Domain configured (if needed)
  □ Analytics setup (Google Analytics)
  
□ DOCUMENTATION
  □ README.md
  □ User guide
  □ Technical documentation
  □ Presentation slides
  
□ PRESENTATION
  □ Demo video (2-3 phút)
  □ Slide deck prepared
  □ Q&A anticipated
  □ Backup plan (offline demo)
```

---

### 🎯 Demo Day - Kế hoạch trình bày

#### **Cấu trúc presentation (10-15 phút)**

**1. Giới thiệu (2 phút)**
- Vấn đề: Giáo dục lịch sử thiếu hấp dẫn
- Giải pháp: Bảo tàng ảo 3D tương tác
- Vision: Công nghệ giúp lịch sử sống động

**2. Demo trực tiếp (5-6 phút)**
- Khởi động game, đi qua 2 phòng đầu
- Highlight tính năng: di chuyển, tương tác, popup
- Show 1-2 điểm ấn tượng (logo hợp nhất, âm thanh)

**3. Behind the scenes (2 phút)**
- Tech stack giới thiệu
- Challenges & solutions
- Team collaboration

**4. Impact & Future (1-2 phút)**
- Educational value
- Metrics (nếu có data)
- Roadmap mở rộng

**5. Q&A (dự phòng 3-5 phút)**

#### **Materials cần chuẩn bị:**
- ✅ **Live demo** (laptop có internet backup)
- ✅ **Demo video** (plan B nếu internet fail)
- ✅ **Presentation slides** (Google Slides/PowerPoint)
- ✅ **QR code** để audience scan thử ngay
- ✅ **One-pager** (infographic tóm tắt dự án)

---

### 💬 Câu hỏi thường gặp (FAQs)

**Q: Game này có chạy được trên điện thoại không?**
A: Có! Game được thiết kế responsive, chạy mượt trên mobile browsers. Tuy nhiên trải nghiệm tốt nhất vẫn là trên desktop với chuột + bàn phím.

**Q: Tại sao chọn web-based thay vì native app?**
A: 
- Không cần cài đặt, truy cập ngay qua link
- Cross-platform tự động (Windows, Mac, Linux, iOS, Android)
- Dễ share và distribute
- Phù hợp với mục tiêu giáo dục (giáo viên gửi link cho học sinh)

**Q: Làm sao để game load nhanh hơn?**
A:
- Optimize 3D models (low poly, Draco compression)
- Lazy loading - chỉ load phòng hiện tại
- Compress textures (WebP, JPG quality 80%)
- CDN cho assets
- Progressive loading UI

**Q: Game có thu thập dữ liệu người dùng không?**
A: Chỉ thu thập analytics cơ bản (Google Analytics): thời gian chơi, completion rate, browser type. KHÔNG thu thập thông tin cá nhân. Tuân thủ GDPR.

**Q: Có thể sử dụng cho mục đích thương mại không?**
A: Dự án này là phi lợi nhuận, mục đích giáo dục. Nếu muốn phát triển thương mại, cần xin phép về bản quyền nội dung lịch sử và hình ảnh.

**Q: Làm sao để contribute/improve game?**
A: Open source trên GitHub! Fork, tạo pull request. Xem CONTRIBUTING.md trong repo.

---

### 📚 Tài liệu tham khảo

#### **Lịch sử:**
1. Ban Tuyên giáo Trung ương (2020). *Nguyễn Ái Quốc - Con đường tìm đến chủ nghĩa Mác-Lênin*
2. Viện Hồ Chí Minh. *Hồ Chí Minh Toàn tập*
3. Museum Hồ Chí Minh. *Triển lãm thường trực*

#### **Technical:**
1. A-Frame Documentation - https://aframe.io/docs/
2. Three.js Manual - https://threejs.org/manual/
3. Web Performance Best Practices - web.dev
4. WebXR Device API - https://www.w3.org/TR/webxr/

#### **Game Design:**
1. Jesse Schell - *The Art of Game Design*
2. Tracy Fullerton - *Game Design Workshop*
3. Educational Games Research (papers từ DiGRA)

#### **Inspiration:**
1. Google Arts & Culture Virtual Tours
2. The British Museum Virtual Tour
3. Anne Frank House VR
4. Smithsonian Virtual Exhibits

---

### 🏆 Kết luận

**"Bảo tàng Ảo Nguyễn Ái Quốc"** không chỉ là một sản phẩm công nghệ, mà là:

> 💡 **Một cầu nối** giữa quá khứ và hiện tại
> 
> 📚 **Một công cụ giáo dục** hiện đại và hiệu quả
> 
> 🎨 **Một tác phẩm nghệ thuật** kết hợp lịch sử - công nghệ - thiết kế
> 
> ❤️ **Một tấm lòng** của thế hệ trẻ hướng về truyền thống cách mạng

Chúng tôi tin rằng, thông qua trải nghiệm tương tác 3D này, người chơi - đặc biệt là thế hệ trẻ - sẽ:
- ✅ Hiểu sâu sắc hơn về hành trình chuẩn bị thành lập Đảng của Nguyễn Ái Quốc
- ✅ Trân trọng hơn những giá trị cách mạng tiền bối đã dày công xây dựng
- ✅ Tự hào hơn về lịch sử dân tộc
- ✅ Có thêm động lực học tập và cống hiến

**Cảm ơn đã đọc tài liệu thiết kế này!**

---

## 📎 PHỤ LỤC

### A. Asset List chi tiết

| ID | Tên Asset | Loại | Room | Format | Kích thước | Priority |
|----|-----------|------|------|--------|------------|----------|
| A001 | Chiếc vali | 3D Model | 1 | GLB | ~2MB | High |
| A002 | Bản đồ thế giới | 3D/Image | 1 | GLB/PNG | ~1MB | High |
| A003 | Giấy Versailles | Image | 1 | PNG | ~500KB | Medium |
| A004 | Tàu hơi nước | 3D Model | 1 | GLB | ~3MB | Low |
| A005 | Sách Lênin | 3D Model | 2 | GLB | ~1MB | High |
| A006 | Báo Le Paria | Image | 2 | PNG | ~800KB | High |
| A007 | Ảnh Hội Liên hiệp | Image | 2 | JPG | ~300KB | Medium |
| ... | ... | ... | ... | ... | ... | ... |

*(Xem file Excel đầy đủ: `docs/asset-list.xlsx`)*

---

### B. Color Reference

```css
/* Primary Colors */
--red-primary: #C62828;
--yellow-primary: #FFD54F;
--cream: #FFF9E6;
--black: #121212;

/* Room Colors */
--room1-blue: #1976D2;
--room2-indigo: #283593;
--room3-orange: #EF6C00;
--room4-red: #C62828;

/* UI Colors */
--success: #43A047;
--warning: #FFA000;
--error: #D32F2F;
--info: #1976D2;

/* Grays */
--gray-100: #F5F5F5;
--gray-300: #E0E0E0;
--gray-500: #9E9E9E;
--gray-700: #616161;
--gray-900: #212121;
```

---

### C. Font Sizes

```css
/* Headings */
--h1: 48px;  /* Page titles */
--h2: 36px;  /* Room titles */
--h3: 24px;  /* Popup titles */
--h4: 20px;  /* Sub-headings */

/* Body */
--body-large: 18px;  /* Quotes */
--body: 16px;        /* Default */
--body-small: 14px;  /* Captions */

/* UI */
--button: 16px;
--label: 14px;
--tooltip: 12px;
```

---

### D. Credits Template

```
═══════════════════════════════════════
    BẢO TÀNG ẢO NGUYỄN ÁI QUỐC
   The Virtual Museum Experience
═══════════════════════════════════════

🎓 DEVELOPED BY
[Tên trường/lớp]
[Học kỳ/Năm học]

👥 TEAM MEMBERS
• [Tên] - Project Manager
• [Tên] - UI/UX Designer
• [Tên] - 3D Artist
• [Tên] - Frontend Developer
• [Tên] - Backend Developer
• [Tên] - Content Writer
• [Tên] - QA/Audio Engineer

🙏 SPECIAL THANKS
• [Tên giảng viên] - Instructor
• [Tổ chức] - Historical resources
• [Nguồn] - 3D models & assets

🔧 BUILT WITH
• A-Frame 1.4.0
• Three.js r150
• GSAP Animation
• Howler.js Audio

📚 HISTORICAL SOURCES
• Viện Hồ Chí Minh
• Bảo tàng Hồ Chí Minh
• [Các nguồn khác]

📝 LICENSE
Educational use only
© 2025 [Team Name]

═══════════════════════════════════════
Made with ❤️ for Vietnamese history education
═══════════════════════════════════════
```

---

### E. Quick Start Guide (For Developers)

```bash
# 1. Clone repository
git clone https://github.com/yourteam/nguyen-ai-quoc-museum.git
cd nguyen-ai-quoc-museum

# 2. Install dependencies (if using build tools)
npm install

# 3. Run local server
# Option A: Python
python -m http.server 8000

# Option B: Node.js
npx http-server -p 8000

# Option C: VS Code Live Server extension
# Just click "Go Live"

# 4. Open browser
# Navigate to http://localhost:8000

# 5. Start developing!
# Edit files in src/, assets/, styles/
# Refresh browser to see changes
```

---

**🎉 HẾT TÀI LIỆU THIẾT KẾ 🎉**

**Document version:** 1.0  
**Last updated:** [Ngày hiện tại]  
**Status:** ✅ Ready for development  

---

*Chúc team thành công với dự án! Nếu có thắc mắc hoặc cần support, đừng ngần ngại liên hệ.*