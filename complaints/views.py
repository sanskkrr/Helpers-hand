from django.shortcuts import render, redirect
from .models import Complaint
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required

def register_complaint(request):
    if request.method == "POST":
        name = request.POST.get("complainantName")
        email = request.POST.get("complainantEmail")
        phone = request.POST.get("complainantPhone")

        category = request.POST.get("category")
        priority = request.POST.get("priority")

        subject = request.POST.get("subject")
        description = request.POST.get("description")

        Complaint.objects.create(
            complainant_name=name,
            complainant_email=email,
            complainant_phone=phone,
            category=category,
            priority=priority,
            subject=subject,
            description=description
        )

        return redirect("/")

    return render(request, "index.html")


from .models import Complaint

from django.shortcuts import render
from .models import Complaint

from django.db.models import Q

from django.db.models import Q


@login_required
def home(request):

    query = request.GET.get("q")
    status_filter = request.GET.get("status")
    priority_filter = request.GET.get("priority")

    complaints = Complaint.objects.all()

    if query:
        complaints = complaints.filter(
            Q(complainant_name__icontains=query) |
            Q(category__icontains=query) |
            Q(priority__icontains=query) |
            Q(status__icontains=query) |
            Q(description__icontains=query)
        )

    if status_filter:
        complaints = complaints.filter(status=status_filter)

    if priority_filter:
        complaints = complaints.filter(priority=priority_filter)

    stats = {
        "total": complaints.count(),
        "pending": complaints.filter(status="New").count(),
        "progress": complaints.filter(status="In Progress").count(),
        "escalated": complaints.filter(status="Escalated").count(),
        "resolved": complaints.filter(status="Resolved").count(),
        "closed": complaints.filter(status="Closed").count(),
    }

    chart_data = [
        stats["pending"],
        stats["progress"],
        stats["escalated"],
        stats["resolved"],
        stats["closed"]
    ]

    return render(request, "index.html", {
        "complaints": complaints,
        "stats": stats,
        "chart_data": chart_data,
        "query": query
    })

def update_status(request, id):
    complaint = Complaint.objects.get(id=id)
    new_status = request.POST.get("status")
    complaint.status = new_status
    complaint.save()
    return redirect("/")

def complaint_detail(request, id):
    complaint = get_object_or_404(Complaint, id=id)
    return render(request, "complaint_detail.html", {"complaint": complaint})

def update_status(request, id):
    complaint = Complaint.objects.get(id=id)

    if request.method == "POST":
        new_status = request.POST.get("status")
        complaint.status = new_status
        complaint.save()

    return redirect(f"/complaint/{id}/")

def track_complaint(request):

    query = request.GET.get("q")
    complaint = None

    if query:
        if query.startswith("CMP-"):
            query = query.split("-")[-1]

        try:
            complaint = Complaint.objects.filter(id=int(query)).first()
        except:
            complaint = None

    complaints = Complaint.objects.all()

    stats = {
        "total": complaints.count(),
        "pending": complaints.filter(status="New").count(),
        "progress": complaints.filter(status="In Progress").count(),
        "escalated": complaints.filter(status="Escalated").count(),
        "resolved": complaints.filter(status="Resolved").count(),
        "closed": complaints.filter(status="Closed").count(),
    }

    chart_data = [
        stats["pending"],
        stats["progress"],
        stats["escalated"],
        stats["resolved"],
        stats["closed"]
    ]

    return render(request, "index.html", {
        "complaints": complaints,
        "stats": stats,
        "chart_data": chart_data,
        "tracked_complaint": complaint
    })