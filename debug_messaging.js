async function debugMessaging() {
    try {
        const timestamp = Date.now();
        const sellerEmail = `seller_${timestamp}@test.com`;
        const buyerEmail = `buyer_${timestamp}@test.com`;
        const password = 'password123';

        // 1. Register Seller
        console.log('1. Registering Seller...');
        let res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Seller User', email: sellerEmail, password, phone: '1111111111' })
        });
        const seller = await res.json();
        if (!res.ok) throw new Error('Seller Reg Failed: ' + JSON.stringify(seller));

        // 2. Register Buyer
        console.log('2. Registering Buyer...');
        res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Buyer User', email: buyerEmail, password, phone: '2222222222' })
        });
        const buyer = await res.json();
        if (!res.ok) throw new Error('Buyer Reg Failed: ' + JSON.stringify(buyer));

        const sellerHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${seller.token}` };
        const buyerHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${buyer.token}` };

        // 3. Create Listing (by Seller)
        console.log('3. Creating Listing...');
        const listingRes = await fetch('http://localhost:5000/api/market', {
            method: 'POST',
            headers: sellerHeaders,
            body: JSON.stringify({
                title: 'Message Test Pet',
                description: 'Test Description',
                price: 100,
                category: 'Dog',
                location: 'Test City',
                breed: 'Test Breed',
                age: 1,
                images: ['https://via.placeholder.com/150'],
                phone: '1111111111'
            })
        });
        const listing = await listingRes.json();
        if (!listingRes.ok) throw new Error('Create Listing Failed: ' + JSON.stringify(listing));
        console.log('Listing Created ID:', listing._id);

        // 4. Send Message (Buyer -> Seller)
        console.log('4. Sending Message from Buyer to Seller...');
        const msgRes = await fetch('http://localhost:5000/api/messages', {
            method: 'POST',
            headers: buyerHeaders,
            body: JSON.stringify({
                receiverId: listing.seller._id || listing.seller, // listing.seller might be populated or ID
                listingId: listing._id,
                content: 'Hello, is this pet available?'
            })
        });
        const msg = await msgRes.json();
        if (!msgRes.ok) throw new Error('Send Message Failed: ' + JSON.stringify(msg));
        console.log('Message Sent. ID:', msg._id);

        // 5. Check Seller Inbox
        console.log('5. Checking Seller Inbox...');
        const sellerInboxRes = await fetch('http://localhost:5000/api/messages', { headers: sellerHeaders });
        const sellerInbox = await sellerInboxRes.json();
        console.log('Seller Conversations Count:', sellerInbox.length);
        if (sellerInbox.length > 0) {
            console.log('Seller sees conversation with:', sellerInbox[0].partner.name);
            console.log('Last message:', sellerInbox[0].lastMessage.content);
        } else {
            console.error('ERROR: Seller inbox is empty!');
        }

        // 6. Check Buyer Inbox (Outbox)
        console.log('6. Checking Buyer Inbox...');
        const buyerInboxRes = await fetch('http://localhost:5000/api/messages', { headers: buyerHeaders });
        const buyerInbox = await buyerInboxRes.json();
        console.log('Buyer Conversations Count:', buyerInbox.length);
        if (buyerInbox.length > 0) {
            console.log('Buyer sees conversation with:', buyerInbox[0].partner.name);
        } else {
            console.error('ERROR: Buyer inbox is empty!');
        }

    } catch (error) {
        console.error('FAILURE:', error);
    }
}

debugMessaging();
